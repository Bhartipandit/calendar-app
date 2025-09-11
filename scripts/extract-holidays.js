const fs = require("fs");
const path = require("path");
const https = require("https");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const { fromBuffer } = require("pdf2pic");
const os = require("os");
const { fromPath } = require("pdf2pic");

// Define all state URLs (you fill these in)
const statePdfUrls = {
  //ap: "https://gad.ap.gov.in/notifications/notices/2024gad_rt2116.pdf",
  //wb: "https://finance.wb.gov.in/writereaddata/4712-F%28P2%29.pdf",
  central:
    "https://dopt.gov.in/sites/default/files/List%20of%20holidays%202025.pdf",
};

// --- PARSERS --- //
// Andhra Pradesh
function parseAP(text) {
  const regex = /\d+\s+([A-Z\s\-\(\)]+)\s+(\d{2}\.\d{2}\.\d{4})/g;

  let match;
  const holidays = [];

  while ((match = regex.exec(text)) !== null) {
    const title = match[1].trim();
    const rawDate = match[2].split(".").reverse().join("-"); // YYYY-MM-DD
    holidays.push({ title, date: rawDate });
  }

  return holidays;
}

// West Bengal
function parseWestBengal(text) {
  const holidays = [];
  const year = 2025;

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l);

  for (let i = 0; i < lines.length - 1; i++) {
    const title = lines[i];
    const dateLine = lines[i + 1];

    // Match things like "1st January, Wednesday"
    const m = dateLine.match(/(\d{1,2})(st|nd|rd|th)?\s+([A-Za-z]+),/);
    if (m) {
      const day = m[1];
      const month = m[3];

      const dateObj = new Date(`${day} ${month} ${year}`);
      if (!isNaN(dateObj)) {
        holidays.push({
          title,
          date: dateObj.toISOString().split("T")[0],
        });
      }
    }
  }

  return holidays;
}

//central gov
function parseCentralGov(text) {
  const holidays = [];
  const year = 2025;

  // Regex matches: "Republic Day January 26 ... Sunday"
  const regex =
    /(\d+)\s+([A-Za-z][A-Za-z\s]+?)\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})\s+[A-Za-z]+\s+\d+\s+([A-Za-z]+)/g;

  let match;
  while ((match = regex.exec(text)) !== null) {
    const title = match[2].trim();
    const month = match[3];
    const day = match[4];

    const dateObj = new Date(`${day} ${month} ${year}`);
    if (!isNaN(dateObj)) {
      holidays.push({
        title,
        date: dateObj.toISOString().split("T")[0],
        weekday: match[5], // Optional: keep weekday from PDF
      });
    }
  }

  return holidays;
}

// Add more parsers as needed
const parsers = {
  //ap: parseAP,
  //wb: parseWestBengal,
  central: parseCentralGov,
};

// --- Download PDF via https ---
function fetchPdf(url, agent) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          agent,
          headers: {
            "User-Agent": "Mozilla/5.0", // spoof browser
            Accept: "application/pdf",
          },
        },
        (res) => {
          if (res.statusCode !== 200) {
            return reject(new Error(`Failed with status ${res.statusCode}`));
          }
          const chunks = [];
          res.on("data", (d) => chunks.push(d));
          res.on("end", () => resolve(Buffer.concat(chunks)));
        }
      )
      .on("error", reject);
  });
}

// --- OCR from PDF pages ---
async function extractTextWithOCR(buffer) {
  try {
    console.log("⚠️ No text found, running OCR...");
    console.log("Buffer size:", buffer.length);

    // Save buffer to a temp file
    const tmpFile = path.join(os.tmpdir(), "central.pdf");
    fs.writeFileSync(tmpFile, buffer);

    const converter = fromPath(tmpFile, {
      density: 200,
      format: "png",
      width: 1200,
      height: 1600,
    });

    // Convert first page
    const page = await converter(1);
    console.log("OCR conversion output keys:", Object.keys(page));

    if (!page || !page.path) {
      throw new Error("Failed to convert PDF page to image.");
    }

    // Run OCR on the image file
    const { data: { text } } = await Tesseract.recognize(page.path, "eng");
    return text;
  } catch (err) {
    console.error("❌ OCR failed:", err.message);
    return "";
  }
}


// --- MAIN --- //
async function processState(state, url) {
  console.log(`Fetching PDF for ${state}...`);
  const agent = new https.Agent({
    rejectUnauthorized: false,
    secureOptions: require("constants").SSL_OP_LEGACY_SERVER_CONNECT,
  });

  try {
    const buffer = await fetchPdf(url, agent);

    let data;
    try {
      data = await pdfParse(buffer);
    } catch {
      data = { text: "" };
    }

    let text = data.text?.trim();
    if (!text) {
      text = await extractTextWithOCR(buffer);
    }

    // Save raw OCR text for debugging
    fs.writeFileSync(`data/${state}-raw.txt`, text);

    const parser = parsers[state];
    if (!parser) {
      console.warn(`No parser defined for ${state}, skipping.`);
      return;
    }

    const holidays = parser(text);

    const outPath = path.join("data", `${state}.json`);
    fs.writeFileSync(
      outPath,
      JSON.stringify({ state, year: 2025, holidays }, null, 2)
    );

    console.log(
      `✅ Saved ${holidays.length} holidays for ${state} → ${outPath}`
    );
  } catch (err) {
    console.error(`❌ Error processing ${state}:`, err.message);
  }
}

async function run() {
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }

  for (const [state, url] of Object.entries(statePdfUrls)) {
    await processState(state, url);
  }
}

run();
