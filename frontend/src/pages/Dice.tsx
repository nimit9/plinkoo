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
        <div className="items-center m-5 p-5">
            <div className="items-center space-x-4 p-5 mt-4 mb-8" style={{ backgroundColor: 'black', borderRadius:"10px" }}>
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
                    className="px-10 mb-4"
                    onClick={rollDice}
                >
                    Roll Dice
                </Button>
            </div>
            <div className="flex justify-center space-x-4">
                <p className="text-xl font-bold">Result: {diceValue.toFixed(2)}</p>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
                <label htmlFor="clientSeed" className="text-lg font-bold">Client Seed:</label>
                <input
                    type="text"
                    id="clientSeed"
                    value={clientSeed}
                    onChange={(e) => setClientSeed(e.target.value)}
                    placeholder="Client Seed"
                    className="accent-green-500 p-2"
                />
                <label htmlFor="target" className="text-lg font-bold">Target:</label>
                <input
                    type="text"
                    id="target"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Target"
                    className="accent-green-500 p-2"
                />
                <label htmlFor="condition" className="text-lg font-bold">Condition:</label>
                <select
                    id="condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="accent-green-500 p-2"
                >
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                </select>
            </div>
        </div>
    );
};