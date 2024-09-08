import React, { useState } from 'react';
import { Button } from '../components/ui';
import axios from 'axios';
import { baseURL } from '../utils';


export function Dice() {
    const [diceValue, setDiceValue] = useState(1);

    const rollDice = async () => {
        const response = await axios.post(`${baseURL}/api/v1/games/dice/place-bet`, {
            data: JSON.stringify({
                "clientSeed": "R@nd()Ms33d",
                "target": "1",
                "condition": "above"
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
        </div>
    );
};