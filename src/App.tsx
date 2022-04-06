import React, { useState } from 'react';
import {
  RESERVED_WORDS,
  VARIABLE_WORDS,
  WORD_REGEX,
  STRING_REGEX,
  STRING_TEMPLATE_REGEX
} from './constants';
import './App.css';

interface SyntaxIndices {
  [key: number]: number[][];
};

const initialLines = ['for (let i = 1; i <= 10; i++) {', '    console.log(`Pass number ${i}`);', '}'];

function App() {
  const [showFormatted, setShowFormatted] = useState(false);
  const [codeInput, setCodeInput] = useState(initialLines.join('\n'));
  const [lines, setLines] = useState(initialLines);

  const formatCode = () => {
    setShowFormatted(prev => !prev);
  };

  const renderUnformattedCode = () => {
    return lines.map((line, i) => <div key={i} className='line'>{line}</div>);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodeInput(e.target.value);
    setLines(e.target.value.split('\n'));
  };

  const makeUnique = (value: string, index: number, self: string[]) => self.indexOf(value) === index;

  const getSyntaxToBeHighlighted = (): string[][] => {
    let reserved: string[] = [];
    let variables: string[] = [];
    let numbers: string[] = [];
    let strings: string[] = [];
    let stringTemplates: string[] = [];
    lines.forEach(line => {
      const words = line.split(WORD_REGEX);
      words.forEach((word, i) => {
        if (RESERVED_WORDS.includes(word)) {
          reserved.push(word);
          if (VARIABLE_WORDS.includes(word)) {
            variables.push(words[i + 1]);
          }
        }
        if (parseFloat(word) || parseInt(word)) {
          const digits = word.split('');
          numbers.push(...digits);
        }
      })
      const string = line.split(STRING_REGEX)[1];
      if (string) strings.push(string);
      const stringTemplate = line.split(STRING_TEMPLATE_REGEX)[1];
      if (stringTemplate) stringTemplates.push(stringTemplate);
    })
    reserved = reserved.filter(makeUnique);
    variables = variables.filter(makeUnique);
    numbers = numbers.filter(makeUnique);
    strings = strings.filter(makeUnique);
    stringTemplates = stringTemplates.filter(makeUnique);
    return [reserved, variables, numbers, strings, stringTemplates];
  };

  const getIndicesOf = (searchStr: string, str: string) => {
    const searchStrLen = searchStr?.length;
    if (searchStrLen === 0) {
        return [];
    }
    let startIndex = 0, index, indices = [];
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push([index, index + searchStrLen - 1]);
        startIndex = index + searchStrLen;
    }
    return indices;
  };

  const getIndicesToBeHighlighted = (reserved: string[], variables: string[], numbers: string[], strings: string[], stringTemplates: string[]) => {
    const reservedIndices: SyntaxIndices = {};
    const variableIndices: SyntaxIndices = {};
    const numberIndices: SyntaxIndices = {};
    const stringIndices: SyntaxIndices = {};
    const stringTemplateIndices: SyntaxIndices = {};
    lines.forEach((line, i) => {
      reserved.forEach(reservedKeyword => {
        const indices = getIndicesOf(reservedKeyword, line);
        if (indices.length) {
          reservedIndices[i] = [...(reservedIndices[i] || []), ...indices];
        }
      })
      variables.forEach(variable => {
        const indices = getIndicesOf(variable, line);
        if (indices.length) {
          variableIndices[i] = [...(variableIndices[i] || []), ...indices];
        }
      })
      numbers.forEach(number => {
        const indices = getIndicesOf(number, line);
        if (indices.length) {
          numberIndices[i] = [...(numberIndices[i] || []), ...indices];
        }
      })
      strings.forEach(string => {
        const indices = getIndicesOf(string, line);
        if (indices.length) {
          stringIndices[i] = [...(stringIndices[i] || []), ...indices];
        }
      })
      stringTemplates.forEach(stringTemplate => {
        const indices = getIndicesOf(stringTemplate, line);
        if (indices.length) {
          stringTemplateIndices[i] = [...(stringTemplateIndices[i] || []), ...indices];
        }
      })
    })
    return [reservedIndices, variableIndices, numberIndices, stringIndices, stringTemplateIndices]
  }

  const renderFormattedCode = () => {
    // Rules: All numbers red, All vars blue and bold, All reserved keywords bold, All string literals green
    const [reserved, variables, numbers, strings, stringTemplates] = getSyntaxToBeHighlighted();
    const [reservedIndices, variableIndices, numberIndices, stringIndices, stringTemplateIndices] = getIndicesToBeHighlighted(reserved, variables, numbers, strings, stringTemplates);
    return lines.map((line, i) => {
      let formattedLine: JSX.Element[] = [];
      line.split('').forEach((char, j) => {
        let matched = false;
        stringIndices[i] && stringIndices[i].forEach(indices => {
          if (j >= indices[0] && j <= indices[1]) {
            formattedLine.push(<span key={`${i}${j}`} className='string'>{char}</span>);
            matched = true;
          }
        })
        !matched && numberIndices[i] && numberIndices[i].forEach(indices => {
          if (j >= indices[0] && j <= indices[1]) {
            formattedLine.push(<span key={`${i}${j}`} className='number'>{char}</span>);
            matched = true;
          }
        })
        !matched && variableIndices[i] && variableIndices[i].forEach(indices => {
          if (j >= indices[0] && j <= indices[1]) {
            formattedLine.push(<span key={`${i}${j}`} className='variable'>{char}</span>);
            matched = true;
          }
        })
        !matched && stringTemplateIndices[i] && stringTemplateIndices[i].forEach(indices => {
          if (j >= indices[0] && j <= indices[1]) {
            formattedLine.push(<span key={`${i}${j}`} className='string'>{char}</span>);
            matched = true;
          }
        })
        !matched && reservedIndices[i] && reservedIndices[i].forEach(indices => {
          if (j >= indices[0] && j <= indices[1]) {
            formattedLine.push(<span key={`${i}${j}`} className='reserved'>{char}</span>);
            matched = true;
          }
        })
        if (!matched) {
          formattedLine.push(<span key={`${i}${j}`}>{char}</span>);
        }
      })
      return <div key={i} className='line'>{formattedLine}</div>;
    })

  };

  return (
    <div className="App">
      <div className='code-wrap'>
        <div className='column'>
          <h1>Code</h1>
          <textarea value={codeInput} onChange={handleCodeChange} rows={15} cols={40}/>
        </div>
        <div className='column'>
          <button onClick={formatCode}>{showFormatted ? 'Remove Formatting' : 'Format Code'}</button>
        </div>
        <div className='column'>
          <h1>{showFormatted ? 'Formatted' : 'Unformatted'}</h1>
          {showFormatted ? renderFormattedCode() : renderUnformattedCode()}
        </div>
      </div>
    </div>
  );
}

export default App;
