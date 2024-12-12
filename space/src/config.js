function getConfig(authState, contentType) {
    const config = {
        headers: {
            'Content-Type': contentType,
            Authorization: `Token ${authState.token}`
        }
    };
    return config;
}

export default getConfig;