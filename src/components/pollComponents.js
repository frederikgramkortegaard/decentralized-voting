import React, { useState, useEffect, ref } from 'react';
import { _initial_load } from '../blocklogic';

const PollComponent = ({ question, options, votes, onVote }) => {
    return (
        <div className="poll-container" style={{ backgroundColor: "lightgray", "width": "25%", margin: 10 }}>
            <h2>{question}</h2>
            <ul>
                {options.map((option, index) => (
                    <li key={index}>{option} : {votes[index]}</li>
                ))}
            </ul>
            <button onClick={onVote}>Vote</button>
        </div>
    );
};

const PollForm = ({ createPoll }) => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [totalOptions, setTotalOptions] = useState(2);

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleOptionChange = (e, index) => {
        const newOptions = [...options];
        newOptions[index] = e.target.value;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setTotalOptions(totalOptions + 1);
        setOptions([...options, ""]);
    };

    const handleRemoveOption = () => {
        if (totalOptions > 2) {
            setTotalOptions(totalOptions - 1);
            const newOptions = [...options];
            newOptions.pop();
            setOptions(newOptions);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createPoll(question, options);
        // Reset the form
        setQuestion("");
        setOptions(["", ""]);
        setTotalOptions(2);
        // Reload the polls
        _initial_load()

    };

    return (
        <div className="poll-form-container" style={{ backgroundColor: "lightgray", "width": "fit-content", margin: 10, padding: 10 }}>
            <form onSubmit={handleSubmit}>
                <label htmlFor="question">Question: </label>
                <input
                    type="text"
                    name="question"
                    value={question}
                    onChange={handleQuestionChange}
                    required
                />
                <br /><label htmlFor="options">Options: </label>

                {options.map((option, index) => (
                    <input
                        type="text"
                        name="options"
                        value={option}
                        onChange={(e) => handleOptionChange(e, index)}
                        required
                        key={index}
                    />
                ))}
                <div className="buttons">
                    <button type="button" onClick={handleAddOption}>
                        Add Option
                    </button>
                    <button type="button" onClick={handleRemoveOption}>
                        Remove Option
                    </button>
                    <button type="submit">Create Poll</button>
                </div>
            </form>
        </div>
    );
};

export { PollComponent, PollForm };