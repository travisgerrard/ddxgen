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
    const response = await fetch('/api/generateBillingCodes', {
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

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  return (
    <div className="root">
      <Head>
        <title>Generate Billing Codes</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Generate Billing Codes</h1>
          </div>
          <div className="header-subtitle">
            <h2>Generate billing codes from the HPI below</h2>
            <Link href="noteCreate">Create a message</Link> <br />
            <Link href="/">Generate DDx</Link>
          </div>
          <div className="header-subtitle">
            <h3>Enter HPI</h3>
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
                  <p>Codes</p>
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
