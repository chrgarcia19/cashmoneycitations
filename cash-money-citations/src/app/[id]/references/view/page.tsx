import ViewReference from "./displayReference"
import { ErrorBoundary } from "@/app/error/boundary/errorBoundary"

export default function DisplayReference() {
  return (
    <>
      <div className="flex justify-center items-center pt-10">
        <ErrorBoundary>
          <ViewReference />
        </ErrorBoundary>
      </div>
    </>
  )
}
