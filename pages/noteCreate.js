import { Fragment } from 'react';
import { useState } from 'react';
import Head from 'next/head';
import { HitCounter } from '../src/components/HitCounter';
import Link from 'next/link';

const Home = () => {
  const [userInput, setUserInput] = useState('');

  // For the DDx Generation
  const [apiOutput, setApiOutput] = useState('');
  const [ddxList, setDdxList] = useState('');
  const [isGeneratingDDx, setIsGeneratingDDx] = useState(false);

  const callGenerateDDxEndpoint = async ({}) => {
    setIsGeneratingDDx(true);

    console.log('Calling OpenAI...');
    const response = await fetch('/api/generateNote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;

    // let outPutBrokenUp = output.split(/\r?\n/);
    // console.log('Broken up', outPutBrokenUp);

    // setDdxList(outPutBrokenUp);
    setApiOutput(output);
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
        <title>Create Note</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Create Note</h1>
          </div>
          <div className="header-subtitle">
            <h2>Create a note to a patient from the informaiton below</h2>
            <Link href="/">Create a DDx</Link>
            <br />
            <Link href="billingCodes">Generate Billing Codes</Link>
          </div>
          <div className="header-subtitle">
            <h3>Enter base of the note</h3>
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
                  <p>Note</p>
                )}
              </div>
            </a>
          </div>
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Note</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>

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
