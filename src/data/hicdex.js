export const getUserMetaQuery = `query UserMeta($_eq: String = "tz1YJvMiZyXnzvV9pxtAiuCFvaG7XoBZhbUQ") {
    hic_et_nunc_holder(where: { address: { _eq: $_eq } }) {
        name
        metadata
    }
}`

export const getCollabObjkts = `query CollabObjkts {
    hic_et_nunc_token(where: {creator: {is_split: {_eq: true}}}) {
      title
      creator {
        address
        shares {
          administrator
          total_shares
          shareholder {
            holder {
              name
              address
            }
          }
        }
      }
    }
  }`

export async function fetchGraphQL(operationsDoc, operationName, variables) {
    const result = await fetch(
        "https://api.hicdex.com/v1/graphql",
        {
            method: "POST",
            body: JSON.stringify({
                query: operationsDoc,
                variables: variables,
                operationName: operationName
            })
        }
    );
    return await result.json()
}

