import { ReactNode } from "react"

interface RevampedContainerProps {
    children: ReactNode;
}

const RevampedContainer: React.FC<RevampedContainerProps> = ({children}) => {
    return (
        <>
            {children}
        </>
    )
}

export default RevampedContainer