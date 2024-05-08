import { Chip } from "@nextui-org/react";

export function EmailInUseError() {
    return (
        <Chip variant="flat" className="gap-2 text-black" color="warning" startContent={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        }>Email Already in Use</Chip>            
    )
}