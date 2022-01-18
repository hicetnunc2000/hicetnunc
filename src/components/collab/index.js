import { BeneficiaryRow } from "./create/BeneficiaryRow";
import { BeneficiariesUI } from "./create/BeneficiariesUI";
import { CollaboratorRow } from "./create/CollaboratorRow";
import { CollaboratorTable } from "./create/CollaboratorTable";
import { ShareAllocationNotice } from "./create/ShareAllocationNotice";
import { collaboratorTemplate } from "./constants"

const CloseIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 145.2 145.2"><path fill="#fff" d="M145.2 15.7L129.8.3l-57.1 57-57-57L.3 15.7l57 57-57 57.1 15.4 15.4 57-57 57.1 57 15.4-15.4-57-57.1z" /></svg>
    )
}

export {
    CloseIcon,
    BeneficiaryRow,
    BeneficiariesUI,
    CollaboratorRow,
    CollaboratorTable,
    ShareAllocationNotice,
    collaboratorTemplate,
}