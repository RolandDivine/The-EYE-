
import React from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

interface OnboardingTourProps {
  run: boolean;
  onFinish: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ run, onFinish }) => {
  const steps: Step[] = [
    {
      target: 'body',
      content: 'Welcome to DeFi-Scope. Let us show you around the institutional visual intelligence platform.',
      placement: 'center',
      title: 'Welcome!',
    },
    {
      target: '#mode-controller',
      content: 'Switch between Institutional and Retail modes. Institutional mode provides deeper quant analysis, while Retail mode focuses on sentiment and gamified rewards.',
      title: 'Mode Controller',
    },
    {
      target: '#global-search',
      content: 'Search for any token address, name, or use quick commands to navigate the platform.',
      title: 'Global Command Center',
    },
    {
      target: '#market-surface',
      content: 'The Market Surface provides a high-density view of smart money flows and market sentiment across the top 100 assets.',
      title: 'Market Surface',
    },
    {
      target: '#alpha-forge',
      content: 'Our LLM-powered Alpha Forge generates and backtests quant strategies in real-time using Gemini 3.1 Pro.',
      title: 'Alpha Forge',
    },
    {
      target: '#graph-view',
      content: 'Visualize network topology and entropy to detect hidden liquidity clusters and MEV activity.',
      title: 'Graph Visualization',
    },
    {
      target: '#feedback-trigger',
      content: 'Have a suggestion? Use the feedback button to report issues directly to our team.',
      title: 'Feedback',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#2563eb',
          backgroundColor: '#18181b',
          textColor: '#ffffff',
          arrowColor: '#18181b',
        },
        tooltipContainer: {
          textAlign: 'left',
          borderRadius: '24px',
          padding: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        buttonNext: {
          borderRadius: '12px',
          padding: '10px 20px',
          fontWeight: 'bold',
        },
        buttonBack: {
          marginRight: '10px',
          color: '#a1a1aa',
        },
        buttonSkip: {
          color: '#71717a',
        },
      }}
    />
  );
};

export default OnboardingTour;
