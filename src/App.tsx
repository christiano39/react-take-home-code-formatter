import React, { useState } from 'react';
import { RESERVED_WORDS, VARIABLE_WORDS, WORD_REGEX, STRING_REGEX } from './constants';
import './App.css';

interface SyntaxIndices {
  [key: number]: number[][];
}

function App() {
  const [showFormatted, setShowFormatted] = useState(false);

  const lines = ['for (let i = 1; i <= 10; i++) {', '    console.log(`Pass number ${i}`);', '}'];

  const formatCode = () => {
    setShowFormatted(prev => !prev);
  };

  const renderUnformattedCode = () => {
    return lines.map((line, i) => <div key={i} className='line'>{line}</div>);
  };

  const getSyntaxToBeHighlighted = (): string[][] => {
    const reserved: string[] = []
    const variables: string[] = []
    const numbers: string[] = []
    const strings: string[] = []
    lines.forEach(line => {
      const words = line.split(WORD_REGEX)
      words.forEach((word, i) => {
        if (RESERVED_WORDS.includes(word)) {
          reserved.push(word)
          if (VARIABLE_WORDS.includes(word)) {
            variables.push(words[i + 1])
          }
        }
        if (parseFloat(word) || parseInt(word)) {
          numbers.push(word)
        }
      })
      const string = line.split(STRING_REGEX)[1]
      if (string) strings.push(string);
    })
    return [reserved, variables, numbers, strings]
  }

  const getIndicesOf = (searchStr: string, str: string) => {
    const searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    let startIndex = 0, index, indices = [];
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push([index, index + searchStrLen - 1]);
        startIndex = index + searchStrLen;
    }
    return indices;
}

  const getIndicesToBeHighlighted = (reserved: string[], variables: string[], numbers: string[], strings: string[]) => {
    const reservedIndices: SyntaxIndices = {};
    const variableIndices: SyntaxIndices = {};
    const numberIndices: SyntaxIndices = {};
    const stringIndices: SyntaxIndices = {};
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
    })
    return [reservedIndices, variableIndices, numberIndices, stringIndices]
  }

  const renderFormattedCode = () => {
    // Rules: All numbers red, All vars blue and bold, All reserved keywords bold, All string literals green
    const [reserved, variables, numbers, strings] = getSyntaxToBeHighlighted();
    const [reservedIndices, variableIndices, numberIndices, stringIndices] = getIndicesToBeHighlighted(reserved, variables, numbers, strings);
    return lines.map((line, i) => {
      let formattedLine: JSX.Element[] = [];
      line.split('').forEach((char, j) => {
        let matched = false;
        reservedIndices[i] && reservedIndices[i].forEach(indices => {
          if (j >= indices[0] && j <= indices[1]) {
            formattedLine.push(<span key={j} className='reserved'>{char}</span>)
            matched = true;
          }
        })
        !matched && variableIndices[i] && variableIndices[i].forEach(indices => {
          if (j >= indices[0] && j <= indices[1]) {
            formattedLine.push(<span key={j} className='variable'>{char}</span>)
            matched = true;
          }
        })
        !matched && numberIndices[i] && numberIndices[i].forEach(indices => {
          if (j >= indices[0] && j <= indices[1]) {
            formattedLine.push(<span key={j} className='number'>{char}</span>)
            matched = true;
          }
        })
        !matched && stringIndices[i] && stringIndices[i].forEach(indices => {
          if (j >= indices[0] && j <= indices[1]) {
            formattedLine.push(<span key={j} className='string'>{char}</span>)
            matched = true;
          }
        })
        if (!matched) {
          formattedLine.push(<span key={j}>{char}</span>)
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
          {renderUnformattedCode()}
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
