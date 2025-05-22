import { cooksUrl } from "@/app/constants/urls"

type Props = {
    error: {
        message: string
    }
}
const CooksError = ({error}: Props) => {
    // TBD make something smarter to know actual state
    return <div className="text-xs">
        <span>Error loading configuration Check:</span>
        <ul>
            <li>Validate URL: {cooksUrl}</li>
            <li>Check if service is running</li>
        </ul>
        <span>{error.message}</span>
    </div>
}

export default CooksError;