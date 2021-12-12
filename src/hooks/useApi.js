import { useEffect, useState } from 'react';
import axios from 'axios';

export const useApi = (url) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(url).then((response) => {
            setData(response.data);
            setLoading(false);
        });
    }, [url]);

    return { loading, data };
};
