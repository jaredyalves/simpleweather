import { useEffect, useState } from 'react';

interface geolocation {
    lat: number;
    lon: number;
}

interface weather {
    weather: {
        description: string;
        icon: string;
    }[];
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;
    };
}

enum Symbol {
    Celsius,
    Fahrenheit,
}

const App = () => {
    const [data, setData] = useState<weather | null>(null);
    const [query, setQuery] = useState<string>('London, GB');
    const [symbol, setSymbol] = useState(Symbol.Celsius);

    const handleCelsius = () => {
        setSymbol(Symbol.Celsius);
    };

    const handleFahrenheit = () => {
        setSymbol(Symbol.Fahrenheit);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const geolocation = await fetchGeolocation();
                const weather = await fetchWeather(
                    geolocation[0].lat,
                    geolocation[0].lon,
                );

                setData(weather);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchGeolocation = async () => {
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${
                    import.meta.env.VITE_OPENWEATHER_API_KEY
                }`,
            );

            return (await response.json()) as geolocation[];
        };

        const fetchWeather = async (lat: number, lon: number) => {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
                    import.meta.env.VITE_OPENWEATHER_API_KEY
                }`,
            );

            return (await response.json()) as weather;
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
            <div className="flex h-screen flex-col items-center justify-between">
                <div className="flex h-full flex-col items-center justify-center space-y-12">
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

                    <div className="flex items-center justify-center space-x-12">
                        <div className="flex flex-col items-center justify-center">
                            <div className="h-32 w-32">
                                {data?.weather ? (
                                    <img
                                        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
                                        alt={data.weather[0].description}
                                    />
                                ) : (
                                    '...'
                                )}
                            </div>
                        </div>

                        <div className="flex w-32 flex-col items-center space-y-4">
                            <div className="text-8xl font-bold">
                                {data?.main
                                    ? symbol === Symbol.Celsius
                                        ? k2c(data.main.temp)
                                        : k2f(data.main.temp)
                                    : '...'}
                            </div>

                            <div className="flex divide-x">
                                <div className="px-2">
                                    {data?.main
                                        ? k2c(data.main.temp_min)
                                        : '...'}
                                    &deg;
                                </div>
                                <div className="px-2">
                                    {data?.main
                                        ? k2c(data.main.temp_max)
                                        : '...'}
                                    &deg;
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <div className="h-32 w-32">&nbsp;</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center divide-x divide-neutral-400 py-4">
                    <button
                        onClick={handleCelsius}
                        className={`px-2 ${
                            symbol === Symbol.Celsius
                                ? 'text-white'
                                : 'text-neutral-400'
                        }`}
                    >
                        &deg;C
                    </button>
                    <button
                        onClick={handleFahrenheit}
                        className={`px-2 ${
                            symbol === Symbol.Fahrenheit
                                ? 'text-white'
                                : 'text-neutral-400'
                        }`}
                    >
                        &deg;F
                    </button>
                </div>
            </div>
        </>
    );
};

const k2c = (k: number) => {
    return Math.round(k - 273.15);
};

const k2f = (k: number) => {
    return Math.round(k2c(k) * 1.8 + 32);
};

export default App;
