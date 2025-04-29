
const BASE_URL:string = 'http://localhost:8080/api/v1/'

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

export const get = async (url:string) => {
    const response = await fetch(`${BASE_URL}${url}`, {
        method: 'GET',
        headers: headers,
    })
    return response.json()
}

export const post = async (url:string,body:any) => { 
    const respone = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    })
    return respone.json()
}


export const postWithToken = async (url:string,body:any,token:string) => {
    const respone = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: {
            ...headers,
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    })
    return respone.json()
}

export const patch = async(url:string,id:string,body:any) => {
    const respone = await fetch(`${BASE_URL}${url}/${id}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(body),
    })
    return respone.json()
}

export const del = async (url:string,id:string) => {
    const respone = await fetch(`${BASE_URL}${url}/${id}`, {
        method: 'DELETE',
        headers: headers,
    })
    return respone.json()
}
