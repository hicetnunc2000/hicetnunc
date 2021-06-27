export const extractAddress = (input) => {
    const tzPattern = /^.*(tz[\w\d]{34}).*$/i
    let matches = tzPattern.exec(input.trim())

    // Check for contract patterns
    if (!matches) {
        const ktPattern = /^.*(kt[\w\d]{34}).*$/i
        matches = ktPattern.exec(input.trim())
    }

    if (!matches) {
        return false
    }

    return matches[1];
}

export const groupShareTotal = collaborators => collaborators.reduce((sharesAllocated, c) => (c.shares || 0) + sharesAllocated, 0)
