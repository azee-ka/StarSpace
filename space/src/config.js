function getConfig(authState) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${authState.token}`
        }
    };
    return config;
}

export default getConfig;