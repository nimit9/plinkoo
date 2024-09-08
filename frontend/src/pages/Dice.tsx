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
            <div className="space-x-4 mt-4 mb-8">
                <input
                    type="range"
                    min={2}
                    max={98}
                    value={diceValue}
                    onChange={(e) => setDiceValue(Number(e.target.value))}
                    className="accent-green-500 w-full"
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
                <input
                    type="text"
                    value={clientSeed}
                    onChange={(e) => setClientSeed(e.target.value)}
                    placeholder="Client Seed"
                    className="accent-green-500"
                />
                <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Target"
                    className="accent-green-500"
                />
                <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="accent-green-500"
                >
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                </select>
            </div>
        </div>
    );
};