import { useState } from 'react';
import Head from 'next/head';
// import Image from 'next/image';
// import buildspaceLogo from '../assets/buildspace-logo.png';
import { HitCounter } from '../src/components/HitCounter';

const Home = () => {
  const [userInput, setUserInput] = useState('');

  // For the DDx Generation
  const [apiOutput, setApiOutput] = useState('');
  const [ddxList, setDdxList] = useState('');
  const [isGeneratingDDx, setIsGeneratingDDx] = useState(false);

  // For the Why Generation
  const [apiWhyOutput, setApiWhyOutput] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [whyIndex, setWhyIndex] = useState([]);
  const [isGeneratingWhy, setIsGeneratingWhy] = useState(false);

  const callGenerateDDxEndpoint = async ({}) => {
    setIsGeneratingDDx(true);

    console.log('Calling OpenAI...');
    const response = await fetch('/api/generateDDx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log('Output', output);
    console.log('OpenAI replied...', output.text);

    let outPutBrokenUp = output.text.split(/\r?\n/);
    console.log('Broken up', outPutBrokenUp);

    setDdxList(outPutBrokenUp);
    setApiOutput(output.text);
    setIsGeneratingDDx(false);
  };

  const callGenerateWhyEndpoint = async ({ dx, index }) => {
    setIsGeneratingWhy(true);

    console.log('Calling OpenAI...');
    const response = await fetch('/api/generateWhy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput, apiOutput, dx }),
    });

    const data = await response.json();
    console.log('Data', data);

    const { output } = data;
    console.log('Output', output);
    console.log('OpenAI replied...', output.text);

    // setDdxList(outPutBrokenUp);
    var tempArray = apiWhyOutput;
    tempArray[index] = output.text;
    setApiWhyOutput(tempArray);
    setIsGeneratingWhy(false);
  };

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  return (
    <div className="root">
      <Head>
        <title>DDxGen</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>DDxGen</h1>
          </div>
          <div className="header-subtitle">
            <h2>Generate differential diagnoses</h2>
          </div>
          <div className="header-subtitle">
            <h3>Enter HPI below to get started</h3>
          </div>
        </div>
        <div className="prompt-container">
          <textarea
            placeholder="start typing here"
            className="prompt-box"
            value={userInput}
            onChange={onUserChangedText}
          />
          <div className="prompt-buttons">
            <a
              className={
                isGeneratingDDx ? 'generate-button loading' : 'generate-button'
              }
              onClick={callGenerateDDxEndpoint}
            >
              <div className="generate">
                {isGeneratingDDx ? (
                  <span className="loader"></span>
                ) : (
                  <p>DDx</p>
                )}
              </div>
            </a>
          </div>
          {ddxList && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Differential diagnosis</h3>
                </div>
              </div>
              <div className="output-content">
                {ddxList.map((output, index) => (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '15rem',
                      }}
                    >
                      <p>{output}</p>

                      {whyIndex.includes(index) ? (
                        <a
                          href="#"
                          onClick={() => {
                            setWhyIndex(
                              whyIndex.filter((item) => item !== index)
                            );
                            // callGenerateWhyEndpoint({ dx: output, index });
                          }}
                        >
                          <p style={{ color: 'white' }}>close</p>
                        </a>
                      ) : (
                        <a
                          href="#"
                          onClick={() => {
                            setWhyIndex((whyIndex) => [...whyIndex, index]);
                            if (apiWhyOutput[index] === null) {
                              callGenerateWhyEndpoint({ dx: output, index });
                            }
                          }}
                        >
                          <p style={{ color: 'white' }}>why?</p>
                        </a>
                      )}
                    </div>
                    {whyIndex.includes(index) &&
                      apiWhyOutput[index] === null &&
                      isGeneratingWhy && <span className="loader"></span>}
                    {whyIndex.includes(index) && apiWhyOutput && (
                      <p>{apiWhyOutput[index]}</p>
                    )}
                  </>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div> */}
      <HitCounter slug="homePage" />
      <div className="container">
        <div className="header-subtitle">
          <p style={{ fontSize: '12px', color: 'grey', textAlign: 'center' }}>
            This site provides useful information but is not a substitute for
            professional medical advice, diagnosis, or treatment. If you think
            you may have a medical emergency, immediately call your doctor or
            dial 911. Before acting on any of the information here, consult with
            your doctor or nurse to make sure that it is right for you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

//
