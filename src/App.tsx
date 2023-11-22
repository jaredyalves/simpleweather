import { useEffect, useState } from 'react';

interface geolocation {
    lat: number;
    lon: number;
}

interface weather {
    weather: {
        description: string;
    }[];
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;
    };
}

const App = () => {
    const [query, setQuery] = useState<string>('London, GB');
    const [data, setData] = useState<weather | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${
                        import.meta.env.VITE_OPENWEATHER_API_KEY
                    }`,
                );
                const geolocation = (await response.json()) as geolocation[];

                const weather: Response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${
                        geolocation[0].lat
                    }&lon=${geolocation[0].lon}&appid=${
                        import.meta.env.VITE_OPENWEATHER_API_KEY
                    }`,
                );

                setData((await weather.json()) as weather);
            } catch (error) {
                console.error(error);
            }
        };

        const delay = setTimeout(() => {
            void fetchData();
        }, 2000);

        return () => {
            clearTimeout(delay);
        };
    }, [query]);

    const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
        if (e.currentTarget.textContent) {
            setQuery(e.currentTarget.textContent);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    return (
        <>
            <div className="flex h-screen flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center space-y-12">
                    <div className="text-2xl text-neutral-400">
                        Right now in&nbsp;
                        <span
                            autoFocus
                            contentEditable
                            onInput={handleInput}
                            onKeyDown={handleKeyDown}
                            className="border-b border-b-neutral-400 p-2 font-bold text-white focus:border-b-white"
                            dangerouslySetInnerHTML={{ __html: 'London, GB' }}
                        />
                        , {data?.weather?.[0].description ?? '...'}.
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                        <div className="text-8xl font-bold">
                            {data?.main ? k2c(data.main.temp) : '...'}
                        </div>

                        <div className="flex divide-x">
                            <div className="px-2">
                                {data?.main ? k2c(data.main.temp_min) : '...'}
                                &deg;
                            </div>
                            <div className="px-2">
                                {data?.main ? k2c(data.main.temp_max) : '...'}
                                &deg;
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const k2c = (k: number) => {
    return Math.round(k - 273.15);
};

export default App;
