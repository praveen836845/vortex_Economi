import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import './PredictionPage.css';

//////////////Web3 imports//////////////
import { usePublicClient, useReadContract, useWriteContract , useAccount } from 'wagmi';
import { parseEther, type Address } from 'viem';
import { watchContractEvent } from '@wagmi/core'
import { config } from './index'
import { parseAbiItem , formatEther} from 'viem';

interface MarketData {
  currentPrice: number;
  change: number;
  volume: string;
  timeRemaining: string;
  progress: number;
  description: string;
}
// Mock data for the prediction markets
const predictionData = {
  'BTC': {
    currentPrice: 3427.52,
    change: +2.4,
    volume: '1.2B',
    timeRemaining: '3h 45m',
    progress: 65,
    description: 'Ethereum price prediction market'
  },
  'FLR': {
    currentPrice: 63851.20,
    change: +1.8,
    volume: '3.8B',
    timeRemaining: '5h 12m',
    progress: 40,
    description: 'Bitcoin price prediction market'
  },
  'DOGE': {
    currentPrice: 142.75,
    change: -3.2,
    volume: '850M',
    timeRemaining: '7h 30m',
    progress: 25,
    description: 'Solana price prediction market'
  }
};

// Mock voting data
const votingData = Array(10).fill(0).map((_, i) => ({
  id: i + 1,
  voter: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
  amount: `${(Math.random() * 10).toFixed(2)} ETH`,
  prediction: Math.random() > 0.5 ? 'Up' : 'Down',
  timestamp: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m ago`
}));

const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "recipient", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "sender", "type": "address"},
      {"name": "recipient", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "transferFrom",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "owner", "type": "address"},
      {"indexed": true, "name": "spender", "type": "address"},
      {"indexed": false, "name": "value", "type": "uint256"}
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "from", "type": "address"},
      {"indexed": true, "name": "to", "type": "address"},
      {"indexed": false, "name": "value", "type": "uint256"}
    ],
    "name": "Transfer",
    "type": "event"
  }
] as const; 


export default function PredictionPage() {
  const { asset } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Get navigation state
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [voteDirection, setVoteDirection] = useState<'up' | 'down' | null>(null);
  const [voteAmount, setVoteAmount] = useState('');
  const { writeContractAsync } = useWriteContract();
  const [isClaim, setIsClaim] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [marketResolved, setMarketResolved] = useState(false);
  const [targetAmount, setTargetAmount] = useState('');
  const [tokenAddresses, setTokenAddresses] = useState<{
    up: Address | null;
    down: Address | null;
  }>({ up: null, down: null });
  
  const [balances, setBalances] = useState<{
    up: bigint | null;
    down: bigint | null;
  }>({ up: null, down: null });


  const CRYPTO_POOL_ADDRESSES = {
    "BTC": "0x20d39847f01386820e30bc0af5e5733147e363dc",
    "FLR": "0x3ede4e9ebc046eefe822189573d44e378577ef10",
    "DOGE": "0x6ac56d3767009f42d3ab849fdb1b088d1a9143fc",
  }



  const CRYPTO_POOL_ABI = [
    {
      "type": "function",
      "name": "FEE_PERCENTAGE",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "PRECISION",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "STALE_PRICE_THRESHOLD",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "claimRewards",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getConfig",
      "inputs": [],
      "outputs": [
        { "name": "predictAmount_", "type": "uint256", "internalType": "uint256" },
        { "name": "cryptoTargeted_", "type": "string", "internalType": "string" }, // Fixed typo: targated → targeted
        { "name": "oracleAdapter_", "type": "address", "internalType": "address" },
        { "name": "resolveTimestamp_", "type": "uint256", "internalType": "uint256" },
        { "name": "participationDeadline_", "type": "uint256", "internalType": "uint256" },
        { "name": "minStake_", "type": "uint256", "internalType": "uint256" },
        { "name": "initialized_", "type": "bool", "internalType": "bool" },
        { "name": "resolved_", "type": "bool", "internalType": "bool" },
        { "name": "greaterThan_", "type": "bool", "internalType": "bool" },
        { "name": "globalFee_", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getStats",
      "inputs": [{ "name": "user", "type": "address", "internalType": "address" }],
      "outputs": [
        { "name": "userBetGreaterThan_", "type": "bool", "internalType": "bool" },
        { "name": "userStake_", "type": "uint256", "internalType": "uint256" },
        { "name": "totalFor_", "type": "uint128", "internalType": "uint128" },
        { "name": "totalAgainst_", "type": "uint128", "internalType": "uint128" },
        { "name": "stakeFor_", "type": "uint256", "internalType": "uint256" },
        { "name": "stakeAgainst_", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getTokens",
      "inputs": [],
      "outputs": [
        { "name": "highAddr_", "type": "address", "internalType": "address" },
        { "name": "highTotal_", "type": "uint256", "internalType": "uint256" },
        { "name": "highMax_", "type": "uint256", "internalType": "uint256" },
        { "name": "lowAddr_", "type": "address", "internalType": "address" },
        { "name": "lowTotal_", "type": "uint256", "internalType": "uint256" },
        { "name": "lowMax_", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "initialize",
      "inputs": [
        { "name": "predictAmount_", "type": "uint256", "internalType": "uint256" },
        { "name": "cryptoTargeted_", "type": "string", "internalType": "string" }, // Fixed typo
        { "name": "oracleAdapter_", "type": "address", "internalType": "address" },
        { "name": "resolveTimestamp_", "type": "uint256", "internalType": "uint256" },
        { "name": "participationDeadline_", "type": "uint256", "internalType": "uint256" },
        { "name": "minStake_", "type": "uint256", "internalType": "uint256" },
        { "name": "highBetTokenAddress_", "type": "address", "internalType": "address" },
        { "name": "lowBetTokenAddress_", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "predict",
      "inputs": [
        { "name": "prediction", "type": "bool", "internalType": "bool" },
        { "name": "stakeAmount", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "resolve",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "withdrawFees",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    // Events
    {
      "type": "event",
      "name": "HighBetTokenAwarded",
      "inputs": [
        { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
        { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "LowBetTokenAwarded",
      "inputs": [
        { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
        { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Predicted",
      "inputs": [
        { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
        { "name": "prediction", "type": "bool", "indexed": false, "internalType": "bool" },
        { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Resolved",
      "inputs": [
        { "name": "greaterThan", "type": "bool", "indexed": false, "internalType": "bool" },
        { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RewardClaimed",
      "inputs": [
        { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
        { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
      ],
      "anonymous": false
    },
    // Errors
    { "type": "error", "name": "AlreadyInit", "inputs": [] },
    { "type": "error", "name": "AlreadyResolved", "inputs": [] },
    { "type": "error", "name": "AmountMismatch", "inputs": [] },
    { "type": "error", "name": "BelowMinStake", "inputs": [] },
    { "type": "error", "name": "DeadlinePassed", "inputs": [] },
    { "type": "error", "name": "MaxSupplyReached", "inputs": [] },
    { "type": "error", "name": "NoStake", "inputs": [] },
    { "type": "error", "name": "NoWinningStake", "inputs": [] },
    { "type": "error", "name": "NotInit", "inputs": [] },
    { "type": "error", "name": "NotOwner", "inputs": [] },
    { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] },
    { "type": "error", "name": "ResolveTooEarly", "inputs": [] },
    { "type": "error", "name": "RewardAlreadyClaimed", "inputs": [] },
    { "type": "error", "name": "ScaleOverflow", "inputs": [] },
    { "type": "error", "name": "StalePrice", "inputs": [] },
    { "type": "error", "name": "TransferFailed", "inputs": [] }
  ] as const;

  const publicClient = usePublicClient();
  // const {account} = useAccount();

  interface LogEntry {
    address: string;
    args: {
      user: string;
      prediction: boolean;
      amount: bigint;
    };
    blockHash: string;
    blockNumber: bigint;
    data: string;
    eventName: string;
    logIndex: number;
    removed: boolean;
    topics: string[];
    transactionHash: string;
    transactionIndex: number;
  }

  const unwatch = watchContractEvent(config, {
    address: CRYPTO_POOL_ADDRESSES[asset as keyof typeof CRYPTO_POOL_ADDRESSES] as Address,
    abi: CRYPTO_POOL_ABI,
    eventName: 'Predicted',
    onLogs(logs) {
      console.log('Logs changed!', logs)
    },
  })


  async function fetchHistoricalLogs(contractAddress: `0x${string}`) {
    if (!publicClient) {
      console.error('Public client not available');
      setLogs([]);
      return;
    }

    try {
      const latestBlock = await publicClient.getBlockNumber();
      const MAX_BLOCKS_PER_CALL = 30n;
      const BLOCKS_TO_FETCH = 10000n;

      let toBlock = latestBlock;
      let fromBlock = toBlock - BLOCKS_TO_FETCH;
      fromBlock = fromBlock < 0n ? 0n : fromBlock;

      const allLogs: LogEntry[] = [];

      while (toBlock > fromBlock) {
        try {
          const currentFromBlock = toBlock - MAX_BLOCKS_PER_CALL > fromBlock
            ? toBlock - MAX_BLOCKS_PER_CALL
            : fromBlock;

          const logs = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem(
              'event Predicted(address indexed user, bool prediction, uint256 amount)'
            ),
            fromBlock: currentFromBlock,
            toBlock
          });

          // Type assertion for the logs
          const typedLogs = logs as unknown as LogEntry[];
          allLogs.push(...typedLogs);

          // Update state with spread operator for reactivity
          setLogs([...allLogs]);

          toBlock = currentFromBlock - 1n;
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Failed blocks ${fromBlock}-${toBlock}:`, error);
          setLogs([]);
          break;
        }
      }

      // Final update with reversed logs
      const reversedLogs = [...allLogs].reverse();
      setLogs(reversedLogs);
      return reversedLogs;
    } catch (error) {
      console.error('Critical error:', error);
      setLogs([]);
      return [];
    }
  }

  const { data: tokensData } = useReadContract({
    abi: CRYPTO_POOL_ABI,
    address: CRYPTO_POOL_ADDRESSES[asset as keyof typeof CRYPTO_POOL_ADDRESSES] as `0x${string}`,
    functionName: 'getTokens',
  });

  // 2. Update token addresses when data comes in
  useEffect(() => {
    if (tokensData) {
      setTokenAddresses({
        up: tokensData[0],
        down: tokensData[3]
      });
    }
  }, [tokensData]);

  // 3. Fetch balances only when addresses are available
  const { data: upBalance } = useReadContract({
    abi: ERC20_ABI,
    address: tokenAddresses.up as Address,
    functionName: 'balanceOf',
    args:['0x0af700A3026adFddC10f7Aa8Ba2419e8503592f7'],
  });

  const { data: downBalance } = useReadContract({
    abi: ERC20_ABI,
    address: tokenAddresses.down as Address,
    functionName: 'balanceOf',
    args: ['0x0af700A3026adFddC10f7Aa8Ba2419e8503592f7'],
  });

  // 4. Update balances state when new data arrives
  // useEffect(() => {
  //   setBalances(prev => ({
  //     ...prev,
  //     ...(upBalance !== undefined && { up: upBalance }),
  //     ...(downBalance !== undefined && { down: downBalance })
  //   }));
  // }, [upBalance, downBalance]);


  useEffect(() => {
    console.log('Watching for events...')
    unwatch()
    fetchHistoricalLogs(CRYPTO_POOL_ADDRESSES[asset as keyof typeof CRYPTO_POOL_ADDRESSES] as Address);
  }, [])

  const handlePredict = () => {
    if (!voteDirection || !voteAmount) return;

    // Convert ETH amount string to wei (BigInt)
    const amountInWei = parseEther(voteAmount);

    writeContractAsync({
      abi: CRYPTO_POOL_ABI,
      address: CRYPTO_POOL_ADDRESSES[asset as keyof typeof CRYPTO_POOL_ADDRESSES] as Address,
      functionName: 'predict',
      args: [voteDirection === "up", amountInWei], // prediction boolean
      value: amountInWei, // value in wei
    }).then((tx) => {
      console.log("Transaction: ", tx);
      alert(`Predicted ${voteDirection} with ${voteAmount} ETH`);
      setVoteDirection(null);
      setVoteAmount('');
    }).catch(console.error);
  }



  useEffect(() => {
    if (!asset) {
      navigate('/');
      return;
    }

    // Determine the data source
    let data: MarketData;
    if (location.state) {
      // Parse the current price safely (handle both "$1,000" and "1000" formats)
      const priceString = location.state.currentPrice.replace(/[^0-9.-]/g, '');
      data = {
        currentPrice: parseFloat(priceString) || 0,
        change: location.state.priceChange,
        timeRemaining: location.state.timeRemaining,
        progress: location.state.progress,
        volume: location.state.volume,
        description: `${asset} price prediction market`,
      };
    } else if (predictionData[asset as keyof typeof predictionData]) {
      data = predictionData[asset as keyof typeof predictionData];
    } else {
      navigate('/');
      return;
    }
    setMarketData(data);
    // Animation on load
    gsap.from('.prediction-header', {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.market-details', {
      opacity: 0,
      x: -50,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    });

    gsap.from('.vote-section', {
      opacity: 0,
      x: 50,
      duration: 0.8,
      delay: 0.4,
      ease: 'power3.out'
    });

    gsap.from('.votes-table', {
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: 0.6,
      ease: 'power3.out'
    });

  }, [asset, location.state, navigate]);

  //////////////Claiming rewards and fetching logs from the contract//////////////


  const { data: fetchedStats, refetch: refetchFetchedStats } = useReadContract({
    address: CRYPTO_POOL_ADDRESSES[asset as keyof typeof CRYPTO_POOL_ADDRESSES] as Address,
    abi: CRYPTO_POOL_ABI,
    functionName: 'getConfig'
  });


  useEffect(() => {
    const handleFetchedStats = async () => {
      await refetchFetchedStats();
      if (fetchedStats) {
        setMarketResolved(fetchedStats[7] as boolean);
   
        setTargetAmount(Number(fetchedStats[0]).toString());
        
      }
    };
    handleFetchedStats()

    console.log("Fetched stats: ", fetchedStats);
  }, [])








  /////////////////////////////////////////////////////////////////////////////////////


  if (!marketData) return <div className="loading">Loading...</div>;

  return (
    <div className="prediction-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Markets
      </button>

      <div className="prediction-header">
        <h1>{asset} Prediction Market</h1>
        <p className="market-description">{marketData.description}</p>
      </div>

      <div className="market-details">
        <div className="price-info">
          <h2>Current Price</h2>
          <div className="price-display">
            <span className="current-price">${marketData.currentPrice.toLocaleString()}</span>
            <span className={`price-change ${marketData.change > 0 ? 'positive' : 'negative'}`}>
              {marketData.change > 0 ? '+' : ''}{marketData.change}%
            </span>
          </div>

          <h2>Targated Price</h2>
          <div className="price-display">
            {/* <span className="current-price">${formatEther(targetAmount ?? '')}</span> */}
          </div>
          <div>
  Balance of Token Up: {balances.up ? formatEther(balances.up) : ''}   ' '
  And Down Tokens: {balances.down ? formatEther(balances.down) : ''}
</div>
        </div>
        {marketResolved ? (
          <button
            className="claim-reward-btn"
            onClick={() => {
              writeContractAsync({
                abi: CRYPTO_POOL_ABI,
                address: CRYPTO_POOL_ADDRESSES[asset as keyof typeof CRYPTO_POOL_ADDRESSES] as Address,
                functionName: 'claimRewards',
              }).then(() => {
                alert('Rewards claimed successfully!');
                setIsClaim(false);
              }).catch(console.error);
            }}
          >
            Claim Reward
          </button>
        ) : <h2 className='Status_ActivePredication'> Market Status: 🟢</h2>}


        <div className="market-stats">
          <div className="stat-item">
            <div className="stat-label">24h Volume</div>
            <div className="stat-value">{marketData.volume} FLR</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Time Remaining</div>
            <div className="stat-value">{marketData.timeRemaining}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Market Progress</div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${marketData.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="vote-section">
        <h2>Place Your Prediction</h2>
        <div className="vote-actions">
          <button
            className={`up-btn ${voteDirection === 'up' ? 'active' : ''}`}
            onClick={() => setVoteDirection('up')}
          >
            Up ↑
          </button>
          <button
            className={`down-btn ${voteDirection === 'down' ? 'active' : ''}`}
            onClick={() => setVoteDirection('down')}
          >
            Down ↓
          </button>
        </div>

        <div className="vote-amount">
          <input
            type="number"
            placeholder="Amount (ETH)"
            value={voteAmount}
            onChange={(e) => setVoteAmount(e.target.value)}
          />{marketResolved? (<button
            className="submit-vote"
            onClick={handlePredict}
            disabled={!voteDirection || !voteAmount}
          >
            Market Resolved!
          </button>): (<button
            className="submit-vote"
            onClick={handlePredict}
            disabled={!voteDirection || !voteAmount}
          >
            Submit Prediction
          </button>)}

        </div>

        <div className="vote-stats">
          <div className="stat">
            <span className="label">Total Up Votes:</span>
            <span className="value">1,245 (62%)</span>
          </div>
          <div className="stat">
            <span className="label">Total Down Votes:</span>
            <span className="value">763 (38%)</span>
          </div>
          <div className="stat">
            <span className="label">Total Value:</span>
            <span className="value">842 ETH</span>
          </div>
        </div>
      </div>

      <div className="votes-table-container">
        <h2 className='votes-table-label'>Recent Predictions</h2>
        <table className="votes-table">
          <thead>
            <tr>
              <th>Voter</th>
              <th>Amount</th>
              <th>Prediction</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={`${log.transactionHash}-${log.logIndex}`}>
                <td>{log.args.user.slice(0, 6)}...{log.args.user.slice(-4)}</td>
                <td>{(Number(log.args.amount) / 1e18).toFixed(2)} ETH</td>
                <td>
                  <span className={`prediction-badge ${log.args.prediction ? 'up' : 'down'}`}>
                    {log.args.prediction ? 'Up' : 'Down'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length <= 10 && (
          <div className="no-predictions">
            {/* Fetching predictions...  Please wait a moment.<br /> */}
          </div>
        )}
      </div>
    </div>
  );
}