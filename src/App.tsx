import { useEffect, useState } from 'react';

interface geolocation {
    lat: number;
    lon: number;
}

interface weather {
    weather: {
        description: string;
    }[];
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
            </div>
        </>
    );
};

export default App;
