import React, { useState } from 'react';
import { Button } from '../components/ui';
import axios from 'axios';
import { baseURL } from '../utils';

export function Dice() {
    const [diceValue, setDiceValue] = useState(1);
    const [clientSeed, setClientSeed] = useState("R@nd()Ms33d");
    const [target, setTarget] = useState("1");
    const [condition, setCondition] = useState("above");

    const rollDice = async () => {
        const response = await axios.post(`${baseURL}/api/v1/games/dice/place-bet`, {
            data: JSON.stringify({
                "clientSeed": clientSeed,
                "target": target,
                "condition": condition
            }),
        });
        if (response.data.state.result) {
            setDiceValue(response.data.state.result);
        }
    };

    return (
        <div className="items-center m-5 p-5 bg-black">
            <div className="flex justify-center space-x-4">
                <img src="/public/diceblue.png" alt="Dice" className="w-32 h-32" />
                <h2 className="text-4xl font-bold">Dice</h2>
                <img src="/public/diceblue-sm.png" alt="Dice-sm" className="w-32 h-32" />
            </div>
            <div className="flex space-x-4" style={{marginLeft:diceValue+'%'}}>
                <p className="text-xl font-bold">{diceValue.toFixed(2)}</p>
            </div>
            <div className="items-center space-x-4 p-5 mt-4 mb-8 bg-black rounded">
                <input
                    type="range"
                    min={1}
                    max={100}
                    step={0.01}
                    value={diceValue}
                    onChange={(e) => setDiceValue(Number(e.target.value))}
                    className="accent-green-500 w-full"
                    style={{
                        appearance: 'none',
                        height: '5px',
                        borderRadius: '5px',
                        background: 'linear-gradient(to right, #e90f3d, #e90f3d ' + diceValue + '%, #00e700 ' + diceValue + '%, #00e700)',
                        outline: 'none',
                        opacity: '0.7',
                        transition: 'opacity 0.2s',
                    }}
                />
            </div>
            <div className="flex justify-center space-x-4 mb-8">
                <Button
                    className="px-10 mb-4 bg-black"
                    onClick={rollDice}
                >
                    Roll Dice
                </Button>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-white-700 text-xs font-bold mb-2" htmlFor="grid-city">
                        CLient Seed
                    </label>
                    <input
                        type="text"
                        id="clientSeed"
                        value={clientSeed}
                        onChange={(e) => setClientSeed(e.target.value)}
                        placeholder="Client Seed"
                        className="appearance-none block w-full bg-black-200 text-white-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none bg-black focus:border-gray-500" />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-white-700 text-xs font-bold mb-2" htmlFor="grid-zip">
                        Target
                    </label>
                    <input
                        type="number"
                        id="target"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="Target"
                        className="appearance-none block w-full bg-black-200 text-white-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none bg-black focus:border-gray-500" />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-white-700 text-xs font-bold mb-2" htmlFor="grid-state">
                        Condition
                    </label>
                    <div className="relative">
                        <select className="block appearance-none w-full bg-black-200 border border-gray-200 text-white-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none bg-black focus:border-gray-500"
                            id="condition"
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                        >
                            <option>Above</option>
                            <option>Below</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};