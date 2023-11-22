import { useEffect, useRef, useState } from 'react';

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
        feels_like: number;
        humidity: number;
    };
    name: string;
    sys: {
        country: string;
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

    const ref = useRef<HTMLSpanElement>(null);

    const handleCelsius = () => {
        setSymbol(Symbol.Celsius);
    };

    const handleFahrenheit = () => {
        setSymbol(Symbol.Fahrenheit);
    };

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                fetchWeather(
                    position.coords.latitude,
                    position.coords.longitude,
                )
                    .then((weather) => {
                        setQuery(`${weather.name}, ${weather.sys.country}`);
                        if (ref.current) {
                            ref.current.innerHTML = `${weather.name}, ${weather.sys.country}`;
                        }
                        setData(weather);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            });
        }
    }, []);

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
                            ref={ref}
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

                        <div className="flex h-32 w-32 flex-col items-center justify-center space-y-4">
                            <div className="grid grid-cols-2 space-x-2">
                                <div className="flex items-center justify-end">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 320 512"
                                        className="h-6 w-6 fill-neutral-400"
                                    >
                                        <path d="M112 112c0-26.5 21.5-48 48-48s48 21.5 48 48V276.5c0 17.3 7.1 31.9 15.3 42.5C233.8 332.6 240 349.5 240 368c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-18.5 6.2-35.4 16.7-48.9c8.2-10.6 15.3-25.2 15.3-42.5V112zM160 0C98.1 0 48 50.2 48 112V276.5c0 .1-.1 .3-.2 .6c-.2 .6-.8 1.6-1.7 2.8C27.2 304.2 16 334.8 16 368c0 79.5 64.5 144 144 144s144-64.5 144-144c0-33.2-11.2-63.8-30.1-88.1c-.9-1.2-1.5-2.2-1.7-2.8c-.1-.3-.2-.5-.2-.6V112C272 50.2 221.9 0 160 0zm0 416a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
                                    </svg>
                                </div>

                                <div className="flex items-center justify-start font-bold">
                                    {data?.main
                                        ? symbol === Symbol.Celsius
                                            ? k2c(data.main.feels_like)
                                            : k2f(data.main.feels_like)
                                        : '...'}
                                    &deg;
                                </div>
                            </div>

                            <div className="grid grid-cols-2 space-x-2">
                                <div className="flex items-center justify-end">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 384 512"
                                        className="h-6 w-6 fill-neutral-400"
                                    >
                                        <path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z" />
                                    </svg>
                                </div>

                                <div className="flex items-center justify-start font-bold">
                                    {data?.main?.humidity ?? '...'}%
                                </div>
                            </div>
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

const fetchWeather = async (lat: number, lon: number) => {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
            import.meta.env.VITE_OPENWEATHER_API_KEY
        }`,
    );

    return (await response.json()) as weather;
};

export default App;
