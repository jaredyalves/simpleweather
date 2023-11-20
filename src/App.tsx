import { useEffect, useState } from 'react';

const App = () => {
    const [query, setQuery] = useState('London, GB');

    useEffect(() => {
        const delay = setTimeout(() => {
            console.log('query: ', query);
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
                    , broken clouds.
                </div>
            </div>
        </>
    );
};

export default App;
