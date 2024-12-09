function getConfig(authState, contentType = "application/json") {
    const config = {
        headers: {
            'Content-Type': contentType,
            Authorization: `Token ${authState.token}`
        }
    };
    return config;
}

export default getConfig;