import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import PredictionCard from "./Component/PredictionCard.js";
import toast, { Toaster } from 'react-hot-toast';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import PredictionPage from './PredictionPage';
import './App.css';


//////////////////Web3 Imports///////////////////////
import { useAccount, useConnect, useDisconnect, useReadContract, useReadContracts, useWriteContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { formatEther, parseEther } from 'viem';
import type { Address, Abi } from 'viem';
import { form } from 'wagmi/chains';



gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const liquiditySectionRef = useRef<HTMLDivElement | null>(null);
  const swapSectionRef = useRef<HTMLDivElement | null>(null);
  const predictionSectionRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  ////////////////Web3 Constants///////////////////

  const ROUTER_ADDRESS: Address = '0xEC9Bf10d059Aa5307F1B721eA3036477127Df4bd';
  const ROUTER_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_factory",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_WETH",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "WETH",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenA",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenB",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountADesired",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountBDesired",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountAMin",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountBMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "addLiquidity",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountB",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountTokenDesired",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountTokenMin",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountETHMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "addLiquidityETH",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountToken",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountETH",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "factory",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserveIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserveOut",
          "type": "uint256"
        }
      ],
      "name": "getAmountIn",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserveIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserveOut",
          "type": "uint256"
        }
      ],
      "name": "getAmountOut",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        }
      ],
      "name": "getAmountsIn",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        }
      ],
      "name": "getAmountsOut",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserveA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserveB",
          "type": "uint256"
        }
      ],
      "name": "quote",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountB",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenA",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenB",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountAMin",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountBMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "removeLiquidity",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountB",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountTokenMin",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountETHMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "removeLiquidityETH",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountToken",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountETH",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountTokenMin",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountETHMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "approveMax",
          "type": "bool"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "removeLiquidityETHWithPermit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountToken",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountETH",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenA",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenB",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountAMin",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountBMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "approveMax",
          "type": "bool"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "removeLiquidityWithPermit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountB",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapETHForExactTokens",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountOutMin",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapExactETHForTokens",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountOutMin",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapExactTokensForETH",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountOutMin",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapExactTokensForTokens",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountInMax",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapTokensForExactETH",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountInMax",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapTokensForExactTokens",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ] as const;

  const TOKEN_POOL_ADDRESS: Address = '0xb3996774f1f6c05ba5b2e1ed3be9f74b227dbc84'; // Arbitary token address...
  const TOKEN_PAIR_ABI = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount0",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount1",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "Burn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount0",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount1",
          "type": "uint256"
        }
      ],
      "name": "Mint",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount0In",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount1In",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount0Out",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount1Out",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "Swap",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint112",
          "name": "reserve0",
          "type": "uint112"
        },
        {
          "indexed": false,
          "internalType": "uint112",
          "name": "reserve1",
          "type": "uint112"
        }
      ],
      "name": "Sync",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "DOMAIN_SEPARATOR",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "MINIMUM_LIQUIDITY",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "PERMIT_TYPEHASH",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "burn",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount0",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount1",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "factory",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getReserves",
      "outputs": [
        {
          "internalType": "uint112",
          "name": "_reserve0",
          "type": "uint112"
        },
        {
          "internalType": "uint112",
          "name": "_reserve1",
          "type": "uint112"
        },
        {
          "internalType": "uint32",
          "name": "_blockTimestampLast",
          "type": "uint32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_token0",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_token1",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "kLast",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "mint",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "nonces",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "permit",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "price0CumulativeLast",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "price1CumulativeLast",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "skim",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount0Out",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount1Out",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "swap",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "sync",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "token0",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "token1",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const;

  const TOKEN_A_ADDRESS: Address = '0x63599aE00A7A43FaDBc2B72E1390ccbCdd0d455B'; // Arbitrary token
  const TOKEN_B_ADDRESS: Address = '0x81960374004ca95499a720027f76c04871e0DFC2'; // Arbitrary token

  ////////////////Web3 Hooks///////////////////////
  const { address, isConnected, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: writeContractResult, writeContract, isPending: isWritePending, error: writeError } = useWriteContract();
  const { writeContractAsync } = useWriteContract();
  const [isCalculating, setIsCalculating] = useState(false);


  ////////////////Contract Component States///////////////////////
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [swapFromAmount, setSwapFromAmount] = useState('');
  const [swapFromToken, setSwapFromToken] = useState(TOKEN_A_ADDRESS);
  const [swapToToken, setSwapToToken] = useState(TOKEN_B_ADDRESS);
  const [swapToAmount, setSwapToAmount] = useState('');


  ////////////////New Approach////////////////////////

  const FACTORY_ADDRESS = '0x740a8a4d1c764bc156B951777EDB6337d271949d' as Address;
  const FACTORY_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_feeToSetter",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token0",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token1",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "pair",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "PairCreated",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "allPairs",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "allPairsLength",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenA",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenB",
          "type": "address"
        }
      ],
      "name": "createPair",
      "outputs": [
        {
          "internalType": "address",
          "name": "pair",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "feeTo",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "feeToSetter",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "getPair",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_feeTo",
          "type": "address"
        }
      ],
      "name": "setFeeTo",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_feeToSetter",
          "type": "address"
        }
      ],
      "name": "setFeeToSetter",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const;

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
  ] as const; // <-- This 'as const' is crucial for type inference


  const TOKEN_LIST = [
    { symbol: 'C2FLR', address: '0xEd5A496758f8a8d45eBC50a6776452379ae71Ffe' }, // Representing native ETH
    { symbol: 'FLRDown2', address: '0x81960374004ca95499a720027f76c04871e0DFC2' },
    { symbol: 'FLRUp1', address: '0x63599aE00A7A43FaDBc2B72E1390ccbCdd0d455B' },


  ];

  const WETH_ADDRESS = '0xEd5A496758f8a8d45eBC50a6776452379ae71Ffe' as Address


  const [isAddLiquidity, setIsAddLiquidity] = useState(true);
  const [selectedTokenA, setSelectedTokenA] = useState(TOKEN_A_ADDRESS);
  const [selectedTokenB, setSelectedTokenB] = useState(TOKEN_B_ADDRESS);
  const [lpAmount, setLpAmount] = useState('');
  const [lpBalance, setLpBalance] = useState<bigint>();
  const [pairAddress, setPairAddress] = useState<Address | null>();
const [lpTokenAddress, setLpTokenAddress] = useState<Address | null>(null);

const getTokenSymbol = (address: Address): string => {

  const token = TOKEN_LIST.find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  );

  
  return token?.symbol || `Token`;
};

  const { data: fetchedPairAddress, refetch: refetchFetchedPairAddress } = useReadContract({
    abi: FACTORY_ABI,
    address: FACTORY_ADDRESS,
    functionName: 'getPair',
    args: [selectedTokenA, selectedTokenB]
  });

  
  
  const { data: fetchedLpBalanceData, refetch: refetchFetchedLpBalanceData} = useReadContract({
    abi: TOKEN_PAIR_ABI,
    address: pairAddress as Address, // Use pairAddress instead of hardcoded address
    functionName: 'balanceOf',
    args: [address as Address], // Remove ! operator
    query: {
      enabled: !!address && !!pairAddress,
    },
  });

  const { data: reserves, refetch: refetchAmountsOut } = useReadContract({
    abi: TOKEN_PAIR_ABI,
    address: pairAddress as Address,
    functionName: 'getReserves',
    query: {
      enabled: false // We'll manually trigger this when needed
    }
  });

  
useEffect(() => {

  refetchFetchedPairAddress();
  
  setPairAddress(fetchedPairAddress);

  refetchFetchedLpBalanceData();
  
  setLpBalance(fetchedLpBalanceData);


},[ isAddLiquidity, tokenAAmount, selectedTokenA, selectedTokenB]);

const handleLiquidityAction = async () => {
  const loadingToast = toast.loading(
    `${isAddLiquidity ? 'Adding' : 'Removing'} liquidity...`
  );
  
  try {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first.");
      return;
    } 

    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const isETHInvolved = [selectedTokenA, selectedTokenB].includes(WETH_ADDRESS);

    if (isAddLiquidity) {
      const loadingToast = toast.loading('Processing liquidity addition...');
    
      try {
        if (!isConnected || !address) {
          toast.error("Please connect your wallet first.");
          return;
        }
    
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
        const isETHInvolved = [selectedTokenA, selectedTokenB].includes(WETH_ADDRESS);
    
        if (isETHInvolved) {
          // Handle ETH liquidity addition
          const [ethToken, erc20Token] = 
            selectedTokenA === WETH_ADDRESS 
              ? [selectedTokenA, selectedTokenB] 
              : [selectedTokenB, selectedTokenA];
    
          const [ethAmount, erc20Amount] = 
            selectedTokenA === WETH_ADDRESS 
              ? [tokenAAmount, tokenBAmount] 
              : [tokenBAmount, tokenAAmount];
    
          // Approve ERC20 token
          toast("Approving ERC20 token...", { icon: '🔃' });
          await writeContractAsync({
            address: erc20Token,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [ROUTER_ADDRESS, parseEther(erc20Amount)]
          });
         
          // Add liquidity with ETH
          toast("Adding liquidity with ETH...", { icon: '🔃' });
          console.log(" Params ",   parseEther(erc20Amount),parseEther((Number(erc20Amount) * 0.99).toString()), parseEther((Number(ethAmount) * 0.99).toString()), parseEther(ethAmount));
          const tx = await writeContractAsync({
            abi: ROUTER_ABI,
            address: ROUTER_ADDRESS,
            functionName: 'addLiquidityETH',
            args: [
              erc20Token,
              parseEther(erc20Amount),
              parseEther((Number(erc20Amount) * 0.99).toString()), // FIX: ensure correct decimals
              parseEther((Number(ethAmount) * 0.99).toString()),   // FIX: ensure correct decimals
              address,
              BigInt(deadline)
            ],
            value: parseEther(ethAmount)
          });
    
        } else {
          // Handle ERC20 token pair
          toast("Approving tokens...", { icon: '🔃' });
          await Promise.all([
            writeContractAsync({
              address: selectedTokenA,
              abi: ERC20_ABI,
              functionName: 'approve',
              args: [ROUTER_ADDRESS, parseEther(tokenAAmount)]
            }),
            writeContractAsync({
              address: selectedTokenB,
              abi: ERC20_ABI,
              functionName: 'approve',
              args: [ROUTER_ADDRESS, parseEther(tokenBAmount)]
            })
          ]);
    
          // Add liquidity with ERC20 tokens
          toast("Adding liquidity...", { icon: '🔃' });
          const tx = await writeContractAsync({
            abi: ROUTER_ABI,
            address: ROUTER_ADDRESS,
            functionName: 'addLiquidity',
            args: [
              selectedTokenA,
              selectedTokenB,
              parseEther(tokenAAmount),
              parseEther(tokenBAmount),
              parseEther((Number(tokenAAmount) * 0.99).toString()),
              parseEther((Number(tokenBAmount) * 0.99).toString()),
              address,
              BigInt(deadline)
            ]
          });
        }
    
        toast.success(
          <div>
            <p>Liquidity added successfully!</p>
          </div>,
          { duration: 8000 }
        );
    
        setTokenAAmount('');
        setTokenBAmount('');
        
      } catch (error) {
        console.error("Error adding liquidity:", error);
        toast.error(
          `Error: ${error instanceof Error ? error.message : 'Transaction failed'}`
        );
      } finally {
        toast.dismiss(loadingToast);
      }
    } else {
      // Remove liquidity logic
      if (!lpAmount || Number(lpAmount) <= 0) {
        toast.error("Please enter valid LP amount");
        return;
      }

      const liquidity = parseEther(lpAmount);

      // Approve LP tokens
      toast("Approving LP tokens...", { icon: '🔃' });
      await writeContractAsync({
        address: pairAddress!,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [ROUTER_ADDRESS, liquidity]
      });

      if (isETHInvolved) {
        const [token, eth] = selectedTokenA === WETH_ADDRESS
          ? [selectedTokenB, selectedTokenA]
          : [selectedTokenA, selectedTokenB];

        const amountTokenMin = parseEther((Number(tokenAAmount) * 0.99).toString());
        const amountETHMin = parseEther((Number(tokenBAmount) * 0.99).toString());

        await writeContractAsync({
          abi: ROUTER_ABI,
          address: ROUTER_ADDRESS,
          functionName: 'removeLiquidityETH',
          args: [
            token,
            liquidity,
            amountTokenMin,
            amountETHMin,
            address,
            BigInt(deadline)
          ]
        });
      } else {
        const amountAMin = parseEther((Number(tokenAAmount) * 0.99).toString());
        const amountBMin = parseEther((Number(tokenBAmount) * 0.99).toString());

        await writeContractAsync({
          abi: ROUTER_ABI,
          address: ROUTER_ADDRESS,
          functionName: 'removeLiquidity',
          args: [
            selectedTokenA,
            selectedTokenB,
            liquidity,
            amountAMin,
            amountBMin,
            address,
            BigInt(deadline)
          ]
        });
      }

      toast.success("Liquidity removed successfully!");
      setLpAmount('');
    }
  } catch (error) {
    // Error handling
  } finally {
    toast.dismiss(loadingToast);
  }
};
 
useEffect(() => {
  // Define delay time (in milliseconds)
  const DEBOUNCE_DELAY = 1000;

  // --- Handle immediate clearing ---
  // If tokenAAmount is empty, clear tokenBAmount immediately and do nothing else.
  if (!tokenAAmount || tokenAAmount.trim() === '') {
    console.log("Token A Amount is empty, clearing Token B Amount immediately.");
    setTokenBAmount('');
    return; // Stop processing for this effect run
  }

  // --- Setup Debounce Timer ---
  // This function contains the core logic you want to debounce
  const executeFetchAndCalculate = async () => {
    console.log("Debounce delay finished. Fetching reserves and calculating...");
 
    try {
      refetchAmountsOut()
        // Use the 'reserves' state which should be updated by the refetch
        console.log("Reserves (state after refetch):", reserves);

        const [reserveA, reserveB] = reserves || [BigInt(0), BigInt(0)];
        console.log("Using Reserves:", reserveA?.toString(), reserveB?.toString());

        // --- Calculation ---
        const numericTokenAAmount = parseFloat(tokenAAmount); // Use the amount that triggered this effect

        // Double-check conditions before calculating
        if (isNaN(numericTokenAAmount) || numericTokenAAmount <= 0) {
             console.log("Token A amount invalid after debounce delay. Clearing B.");
             setTokenBAmount('');
             return;
        }

        if (reserveA > BigInt(0) && reserveB > BigInt(0)) {
            const numReserveA = Number(reserveA); // Convert BigInt for ratio calculation
            const numReserveB = Number(reserveB);

            if (numReserveA === 0) {
                console.warn("Reserve A is zero, cannot calculate ratio.");
                setTokenBAmount('');
                return;
            }

            const ratio = numReserveB / numReserveA;
            console.log("Calculating Token B amount...");
            console.log("Token A Amount:", numericTokenAAmount);
            console.log("Reserve A:", numReserveA);
            console.log("Reserve B:", numReserveB);
            console.log("Ratio:", ratio);

            const calculatedB = (numericTokenAAmount * ratio).toFixed(18);
            console.log("Calculated Token B amount =", calculatedB);
            setTokenBAmount(calculatedB);
        } else {
            console.log("Skipping calculation: Invalid reserves.", reserveA?.toString(), reserveB?.toString());
            setTokenBAmount(''); // Clear B if reserves are invalid
        }
    } catch (error) {
        console.error("Error during debounced fetch/calculation:", error);
        setTokenBAmount(''); // Clear B on error
    }
  };

  // Set a timer to execute the function after the delay
  console.log(`Setting ${DEBOUNCE_DELAY}ms debounce timer for amount: ${tokenAAmount}`);
  const timerId = setTimeout(executeFetchAndCalculate, DEBOUNCE_DELAY);

  // --- Cleanup Function ---
  // Return a function that clears the timer. React runs this when:
  // 1. The component unmounts.
  // 2. *Before* the effect runs again due to dependency changes.
  return () => {
    console.log("Cleanup: Clearing timer ID:", timerId);
    clearTimeout(timerId);
  };

}, [ 
    tokenAAmount,
    selectedTokenA,
    selectedTokenB,
    // Include stable functions/state setters if needed by ESLint rules,
    // but the core trigger dependencies are usually sufficient.
    setTokenBAmount,
    // refetchFetchedPairAddress,
    // refetchAmountsOut,
    // fetchedPairAddress, // Usually derived, not a trigger
    // reserves           // Usually derived, not a trigger
]); // Keep dependencies focused on what should trigger the *start* of the debounce

const handleSwapNew = async () => {
  const loadingToast = toast.loading('Processing swap...');
  
  try {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first.");
      return;
    }

    if (!swapFromAmount || Number(swapFromAmount) <= 0) {
      toast.error("Please enter a valid amount to swap");
      return;
    }

    if (selectedTokenA === selectedTokenB) {
      toast.error("Cannot swap the same token");
      return;
    }

    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const isETHInvolved = [selectedTokenA, selectedTokenB].includes(WETH_ADDRESS);
    const amountIn = parseEther(swapFromAmount);
    const amountOutMin = parseEther((Number(swapToAmount) * 0.99).toString()); // 1% slippage

    // Handle different swap types
    if (selectedTokenA === WETH_ADDRESS) {
      // ETH -> Token
      toast("Swapping ETH for tokens...", { icon: '🔃' });
      const tx = await writeContractAsync({
        abi: ROUTER_ABI,
        address: ROUTER_ADDRESS,
        functionName: 'swapExactETHForTokens',
        args: [
          amountOutMin,
          [WETH_ADDRESS, selectedTokenB],
          address,
          BigInt(deadline)
        ],
        value: amountIn
      });
    } else if (selectedTokenB === WETH_ADDRESS) {
      // Token -> ETH
      toast("Approving token...", { icon: '🔃' });
      await writeContractAsync({
        address: selectedTokenA,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [ROUTER_ADDRESS, amountIn]
      });

      toast("Swapping tokens for ETH...", { icon: '🔃' });
      const tx = await writeContractAsync({
        abi: ROUTER_ABI,
        address: ROUTER_ADDRESS,
        functionName: 'swapExactTokensForETH',
        args: [
          amountIn,
          amountOutMin,
          [selectedTokenA, WETH_ADDRESS],
          address,
          BigInt(deadline)
        ]
      });
    } else {
      // Token -> Token
      toast("Approving token...", { icon: '🔃' });
      await writeContractAsync({
        address: selectedTokenA,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [ROUTER_ADDRESS, amountIn]
      });

      toast("Swapping tokens...", { icon: '🔃' });
      const tx = await writeContractAsync({
        abi: ROUTER_ABI,
        address: ROUTER_ADDRESS,
        functionName: 'swapExactTokensForTokens',
        args: [
          amountIn,
          amountOutMin,
          [selectedTokenA, selectedTokenB],
          address,
          BigInt(deadline)
        ]
      });
    }

    toast.success(
      <div>
        <p>Swap executed successfully!</p>
      </div>,
      { duration: 8000 }
    );

    setSwapFromAmount('');
    setSwapToAmount('');
    
  } catch (error) {
    console.error("Error swapping tokens:", error);
    toast.error(
      `Error: ${error instanceof Error ? error.message : 'Swap failed'}`
    );
  } finally {
    toast.dismiss(loadingToast);
  }
};


 


 

  const { data: amountOutDataSwap, refetch: refetchAmountsOutSwap } = useReadContract({
    abi: ROUTER_ABI,
    address: ROUTER_ADDRESS,
    functionName: 'getAmountsOut',
    args: [
      swapFromAmount ? parseEther(swapFromAmount) : BigInt(0),
      [selectedTokenA, selectedTokenB],
    ],
    query: {
      enabled: false // We'll manually trigger this when needed
    }
  });


  const handleSwap = async () => {
    const loadingToast = toast.loading('Processing swap...');

    try {
      if (!isConnected || !address) {
        toast.error("Please connect your wallet first.");
        return;
      }

      if (!swapFromAmount || isNaN(parseFloat(swapFromAmount))) {
        toast.error("Please enter a valid amount to swap");
        return;
      }

      if (swapFromToken === swapToToken) {
        toast.error("Cannot swap the same token");
        return;
      }

      toast("Preparing swap...", { icon: '🔃' });

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      const amountIn = parseEther(swapFromAmount);
      const amountOutMin = parseEther("0");

      const tx = await writeContractAsync({
        abi: ROUTER_ABI,
        address: ROUTER_ADDRESS as `0x${string}`,
        functionName: 'swapExactTokensForTokens',
        args: [
          amountIn,
          amountOutMin,
          [swapFromToken as `0x${string}`, swapToToken as `0x${string}`],
          address,
          BigInt(deadline),
        ],
      });

      toast.success(
        <div>
          <p>Swap executed successfully!</p>
          <a
            href={`https://testnet.flarescan.com/tx/${tx}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#4caf50', textDecoration: 'underline' }}
          >
            View on FlareTestnetScan
          </a>
        </div>,
        { duration: 8000 }
      );

      setSwapFromAmount('');
      setSwapToAmount('');

    } catch (error) {
      console.error("Error swapping tokens:", error);
      toast.error(
        `Error: ${error instanceof Error ? error.message : 'Swap failed'}`
      );
    } finally {
      toast.dismiss(loadingToast);
    }
  };


  useEffect(() => {
    // Navbar background change on scroll
    const handleScroll = () => {
      const nav = navRef.current;
      if (!nav) return;

      if (window.scrollY > 100) {
        nav.style.backgroundColor = "rgba(10, 10, 20, 0.9)";
        (nav.style as any).backdropFilter = "blur(10px)";
      } else {
        nav.style.backgroundColor = "transparent";
        (nav.style as any).backdropFilter = "none";
      }
    };

    window.addEventListener('scroll', handleScroll);

    const ctx = gsap.context(() => {
      // Hero section animations
      gsap.from('.hero-text span', {
        opacity: 0,
        y: 100,
        duration: 1,
        stagger: 0.05,
        ease: 'back.out(1.7)'
      });

      gsap.from('.hero-description', {
        opacity: 0,
        y: 50,
        duration: 1.2,
        delay: 0.8,
        ease: 'elastic.out(1, 0.5)'
      });

      gsap.from('.scroll-indicator', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 1.5,
        repeat: -1,
        yoyo: true
      });

      // Section animations
      ScrollTrigger.create({
        trigger: liquiditySectionRef.current,
        start: "top 70%",
        onEnter: () => {
          gsap.from('.liquidity-description', {
            x: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
          });
          gsap.from('.liquidity-card', {
            x: 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.3
          });
        }
      });

      ScrollTrigger.create({
        trigger: swapSectionRef.current,
        start: "top 70%",
        onEnter: () => {
          gsap.from('.swap-description', {
            x: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
          });
          gsap.from('.swap-card', {
            x: 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.3
          });
        }
      });

      ScrollTrigger.create({
        trigger: predictionSectionRef.current,
        start: "top 70%",
        onEnter: () => {
          gsap.from('.prediction-card', {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.5)'
          });
        }
      });

    }, mainRef);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!swapFromAmount || swapFromAmount === '0' || swapFromAmount === '') {
      setSwapToAmount('');
      return;
    }
  
    const calculateTokenBAmount = async () => {
      try {
        setIsCalculating(true);
        
        // Get fresh data directly from the refetch response
        const { data: freshAmountData } = await refetchAmountsOutSwap();
        
        console.log("swap to amount", freshAmountData);
        if (freshAmountData && freshAmountData.length > 1) {
          const amountB = formatEther(freshAmountData[1]);
          setSwapToAmount(amountB);
        }
      } catch (error) {
        console.error("Error calculating Token B amount:", error);
        setSwapToAmount('');
      } finally {
        setIsCalculating(false);
      }
    };
  
    // Add basic debouncing
    const debounceTimer = setTimeout(calculateTokenBAmount, 300);
    return () => clearTimeout(debounceTimer);
  }, [selectedTokenA, selectedTokenB, swapFromAmount]);

 



  const scrollToSection = (ref: any) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: 'smooth'
    });
  };

  const handlePredictionCardClick = (asset: string) => {
    navigate(`/prediction/${encodeURIComponent(asset)}`);
  };


  //////////////////////////////Prediction Card Logic//////////////////////////////////////

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
  const CRYPTO_POOL_ADDRESSES = {
    "BTC": "0x20d39847f01386820e30bc0af5e5733147e363dc",
    "FLR": "0x3ede4e9ebc046eefe822189573d44e378577ef10",
    "DOGE": "0x6ac56d3767009f42d3ab849fdb1b088d1a9143fc",
  }

  const FTSO_ABI = [
    {
      type: "function",
      name: "getPriceFeed",
      inputs: [
        { name: "_feedName", type: "string", internalType: "string" }
      ],
      outputs: [
        { name: "_feedValue", type: "uint256", internalType: "uint256" },
        { name: "_decimal", type: "int8", internalType: "int8" },
        { name: "_timestamp", type: "uint64", internalType: "uint64" }
      ],
      stateMutability: "view" // Changed from nonpayable to view
    },
    // ... other ABI entries
  ] as const;
  const FTSO_ADDRESS = "0x9035681200aAA554E61B2D13319991c5ABCB92C8";

  const [prices, setPrices] = useState({
    BTC: '0.000',
    FLR: '0.000',
    DOGE: '0.000'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  //////////Price Fetching////////////////

  const { data: priceDataBTC, refetch: refetchPriceDataBTC } = useReadContract({
    abi: FTSO_ABI,
    address: FTSO_ADDRESS,
    functionName: 'getPriceFeed',
    args: ['BTC'],
    query: {
      enabled: false // We'll manually trigger this when needed
    }
  })
  const { data: priceDataFLR, refetch: refetchPriceDataFLR } = useReadContract({
    abi: FTSO_ABI,
    address: FTSO_ADDRESS,
    functionName: 'getPriceFeed',
    args: ['FLR'],
    query: {
      enabled: false // We'll manually trigger this when needed
    }
  })
  const { data: priceDataDOGE, refetch: refetchPriceDataDOGE } = useReadContract({
    abi: FTSO_ABI,
    address: FTSO_ADDRESS,
    functionName: 'getPriceFeed',
    args: ['DOGE'],
    query: {
      enabled: false // We'll manually trigger this when needed
    }
  })

  const formatPrice = (rawValue: bigint, decimals: number): string => {
    const adjustedValue = Number(rawValue) / (10 ** decimals);
    return (Math.floor(adjustedValue * 1000) / 1000).toFixed(3);
  };

  // Fetch and update prices
  const handleRefreshPrices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Execute all price fetches in parallel
      const [btcResult, flrResult, dogeResult] = await Promise.all([
        refetchPriceDataBTC(),
        refetchPriceDataFLR(),
        refetchPriceDataDOGE()
      ]);

      // Update state with formatted values
      setPrices({
        BTC: formatPrice(btcResult.data?.[0] || 0n, priceDataBTC?.[1] ?? 10),
        FLR: formatPrice(flrResult.data?.[0] || 0n, priceDataFLR?.[1] ?? 10),
        DOGE: formatPrice(dogeResult.data?.[0] || 0n, priceDataDOGE?.[1] ?? 10)
      });
    } catch (err) {
      setError('Failed to fetch prices. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleRefreshPrices();
  }, [priceDataBTC, priceDataFLR, priceDataDOGE]);


  ///////////End-in Fetching///////////////

  type PoolConfig = [
    predictAmount_: bigint,
    cryptoTargeted_: string,
    oracleAdapter_: Address,
    resolveTimestamp_: bigint,
    participationDeadline_: bigint,
    minStake_: bigint,
    initialized_: boolean,
    resolved_: boolean,
    greaterThan_: boolean,
    globalFee_: bigint
  ];

  const [deadlines, setDeadlines] = useState({
    BTC: "0",
    FLR: "0",
    DOGE: "0"
  })



  const { data: configDataBtc, refetch: refetchConfigDataBtc } = useReadContract({
    abi: CRYPTO_POOL_ABI,
    address: CRYPTO_POOL_ADDRESSES.BTC as Address,
    functionName: 'getConfig',
    query: {
      enabled: false
    }
  })

  const { data: configDataFlr, refetch: refetchConfigDataFlr } = useReadContract({
    abi: CRYPTO_POOL_ABI,
    address: CRYPTO_POOL_ADDRESSES.FLR as Address,
    functionName: 'getConfig',
    query: {
      enabled: false
    }
  })

  const { data: configDataDoge, refetch: refetchConfigDataDoge } = useReadContract({
    abi: CRYPTO_POOL_ABI,
    address: CRYPTO_POOL_ADDRESSES.DOGE as Address,
    functionName: 'getConfig',
    query: {
      enabled: false
    }
  })

  const handleTimestamps = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Execute all price fetches in parallel
      const [btcTime, flrTime, dogeTime] = await Promise.all([
        refetchConfigDataBtc(),
        refetchConfigDataFlr(),
        refetchConfigDataDoge()

      ]);
      // Update state with formatted values
      setDeadlines({
        BTC: formatTimestamp((btcTime.data as unknown as PoolConfig)?.[4]?.toString() || "0"),
        FLR: formatTimestamp((flrTime.data as unknown as PoolConfig)?.[4]?.toString() || "0"),
        DOGE: formatTimestamp((dogeTime.data as unknown as PoolConfig)?.[4]?.toString() || "0")
      });
    } catch (err) {
      setError('Failed to fetch prices. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (deadline: string) => {
    // Convert to numbers and validate
    const deadlineTimestamp = parseInt(deadline, 10);
    const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds

    if (isNaN(deadlineTimestamp)) return 'Invalid deadline';

    const remainingSeconds = deadlineTimestamp - currentTimestamp;

    // Handle expired or invalid times
    if (remainingSeconds <= 0) return 'Expired';

    // Calculate time units
    const days = Math.floor(remainingSeconds / 86400); // 1 day = 86400 seconds
    const hours = Math.floor((remainingSeconds % 86400) / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);

    // Build human-readable format
    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`); // Always show minutes if no other units

    return parts.join(' ');
  };


  useEffect(() => {
    handleTimestamps();
    handleVolume();
  }, []);


  ////////////Progress fetching///////////////////////

  //@To-Do: Add progress fetching logic here after adding initializing timestamp to the contract


  ////////////////Volume fetching/////////////////////// 

  type PoolStats = [
    userBetGreaterThan_: boolean,
    userStake_: bigint,
    totalFor_: bigint,
    totalAgainst_: bigint,
    stakeFor_: bigint,
    stakeAgainst_: bigint
  ];

  const { data: volumeDataBtc, refetch: refetchVolumeDataBtc } = useReadContract({
    abi: CRYPTO_POOL_ABI,
    address: CRYPTO_POOL_ADDRESSES.BTC as Address,
    functionName: 'getStats',
    args: [address as Address],
    query: {
      enabled: false // We'll manually trigger this when needed
    }
  })

  const { data: volumeDataFlr, refetch: refetchVolumeDataFlr } = useReadContract({
    abi: CRYPTO_POOL_ABI,
    address: CRYPTO_POOL_ADDRESSES.FLR as Address,
    functionName: 'getStats',
    args: [address as Address],
    query: {
      enabled: false // We'll manually trigger this when needed
    }
  })

  const { data: volumeDataDoge, refetch: refetchVolumeDataDoge } = useReadContract({
    abi: CRYPTO_POOL_ABI,
    address: CRYPTO_POOL_ADDRESSES.DOGE as Address,
    functionName: 'getStats',
    args: [address as Address],
    query: {
      enabled: false // We'll manually trigger this when needed
    }
  })

  const [volumes, setVolumes] = useState({
    BTC: '0.000',
    FLR: '0.000',
    DOGE: '0.000'
  });

  const handleVolume = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [btcResult, flrResult, dogeResult] = await Promise.all([
        refetchVolumeDataBtc(),
        refetchVolumeDataFlr(),
        refetchVolumeDataDoge()
      ])

      setVolumes({
        BTC: formatEther((btcResult.data as unknown as PoolStats)[4]).toString(),
        FLR: formatEther((flrResult.data as unknown as PoolStats)[4]).toString(),
        DOGE: formatEther((dogeResult.data as unknown as PoolStats)[4]).toString()
      });
    } catch (err) {
      setError('Failed to fetch prices. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  console.log("Volume data:", tokenBAmount);


  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1e2d',
            color: '#fff',
            border: '1px solid #2d2d3d',
            borderRadius: '12px',
            fontSize: '14px'
          },
          success: {
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
      <div ref={mainRef} className="app-container">
        {/* Navbar */}
        <nav ref={navRef} className="navbar">
          <div className="nav-content">
            <div className="nav-logo"> VortexEconomi </div>
            <div className="nav-links">
              <button onClick={() => scrollToSection(heroRef)}>Home</button>
              <button onClick={() => scrollToSection(liquiditySectionRef)}>Liquidity</button>
              <button onClick={() => scrollToSection(swapSectionRef)}>Swap Tokens</button>
              <button onClick={() => scrollToSection(predictionSectionRef)}>Prediction</button>
            </div>
 
            <div className="wallet-connect">
              {isConnected ? (
                <button
                  className="action-btn gradient-pulse connected"
                  onClick={() => disconnect()}
                >
                  <span className="truncated-address">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                  <span className="disconnect-label">Disconnect</span>
                </button>
              ) : (
                <button
                  className="action-btn gradient-pulse"
                  onClick={() => connect({ connector: injected() })}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </nav>

        <video autoPlay muted loop className="background-video">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-woman-using-her-credit-card-41596-large.mp4" type="video/mp4" />
        </video>

        {/* Hero Section */}
        <div ref={heroRef} className="hero-section">
          <div className="content-container">
            <header className="hero">
              <h1 className="hero-text">
                VortexEconomi
              </h1>
              <p className="hero-description">
                Revolutionizing DeFi with a next-generation DEX, AI-powered prediction markets,
                and institutional-grade price feeds - all secured by Flare's decentralized
                Time Series Oracle network.
              </p>
              <div className="scroll-indicator">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
            </header>
          </div>
        </div>

        {/* Liquidity Section */}
        <div ref={liquiditySectionRef} className="section-container">
  <div className="content-container">
    <div className="section-content">
      <div className="liquidity-description">
        <h2>Liquidity Pools</h2>
        <p className="glow-text">
          Become a market maker in our Uniswap V2-powered liquidity pools and earn {' '}
          <span className="highlight">0.3% fee on every trade</span> proportional to your stake. {' '}
          <span className="highlight">APYs up to 45%</span> through FLR token rewards, while our optimized pool
          architecture reduces impermanent loss by up to 30% compared to standard AMMs.
          <span className="highlight">All pricing is continuously verified by Flare's decentralized oracle network, </span>
          ensuring <span className="highlight">fair asset valuation</span> and protection against manipulation.
        </p>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">$42.8B</div>
            <div className="stat-label">Total Value Locked</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">1.2M</div>
            <div className="stat-label">Active Providers</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">12-48%</div>
            <div className="stat-label">Average APY</div>
          </div>
        </div>
      </div>

      <div className="liquidity-card-mod section-card">
  <div className="card-content">
    <div className="liquidity-toggle-mod">
      <button 
        className={`liquidity-toggle-btn-mod ${isAddLiquidity ? 'liquidity-toggle-btn-active-mod' : ''}`}
        onClick={() => setIsAddLiquidity(true)}
      >
        Add
      </button>
      <button 
        className={`liquidity-toggle-btn-mod ${!isAddLiquidity ? 'liquidity-toggle-btn-active-mod' : ''}`}
        onClick={() => setIsAddLiquidity(false)}
      >
        Remove
      </button>
    </div>

    <h2>{isAddLiquidity ? 'Add' : 'Remove'} Liquidity</h2>
    
    <div className="token-select-wrapper-mod">
      <select
        className={`token-select-mod ${!isAddLiquidity ? 'token-select-disabled-mod' : ''}`}
        value={selectedTokenA}
        onChange={(e) => setSelectedTokenA(e.target.value as Address)}
        disabled={!isAddLiquidity}
      >
        {TOKEN_LIST.map(token => (
          <option key={token.address} value={token.address}>
            {token.symbol}
          </option>
        ))}
      </select>
      <select 
        className={`token-select-mod ${!isAddLiquidity ? 'token-select-disabled-mod' : ''}`}
        value={selectedTokenB}
        onChange={(e) => setSelectedTokenB(e.target.value as Address)}
        disabled={!isAddLiquidity}
      >
        {TOKEN_LIST.map(token => (
          <option key={token.address} value={token.address}>
            {token.symbol}
          </option>
        ))}
      </select>
    </div>

    {isAddLiquidity ? (
      <>
        <div className="liquidity-input-group-mod">
          <input
            type="number"
            className="liquidity-input-mod"
            placeholder={`${getTokenSymbol(selectedTokenA)} Amount`}
            value={tokenAAmount}
            onChange={(e) => setTokenAAmount(e.target.value)}
          />
          <input
            type="number"
            className="liquidity-input-mod"
            placeholder={`${getTokenSymbol(selectedTokenB)} Amount`}
            value={tokenBAmount}
            readOnly
          />
        </div>
        <div className="liquidity-info-mod">
          <span>Pool Ratio: 1 {getTokenSymbol(selectedTokenA)} = 
            {(Number(tokenBAmount)/Number(tokenAAmount)).toFixed(4)} {getTokenSymbol(selectedTokenB)}
          </span>
        </div>
      </>
    ) : (
      <>
        <div className="liquidity-input-group-mod">
          <span>Available LP: {formatEther((lpBalance as bigint) || 0n)}</span>
          <input
            type="number"
            className="liquidity-input-mod"
            placeholder="LP Token Amount"
            value={lpAmount}
            onChange={(e) => setLpAmount(e.target.value)}
            max={Number(formatEther((lpBalance as bigint) || 0n))}
          />
        </div>
        <div className="liquidity-info-mod">
          <span>You will receive:</span>
          <span>{tokenAAmount} {getTokenSymbol(selectedTokenA)}</span>
          <span>{tokenBAmount} {getTokenSymbol(selectedTokenB)}</span>
        </div>
      </>
    )}

    <button 
      className={`liquidity-action-btn-mod ${(!isAddLiquidity && Number(lpAmount) <= 0) ? 'liquidity-action-btn-disabled-mod' : ''}`}
      onClick={handleLiquidityAction}
      disabled={!isAddLiquidity && Number(lpAmount) <= 0}
    >
      {isAddLiquidity ? 'Add Liquidity' : 'Remove Liquidity'}
    </button>

    <div className="liquidity-stats-mod">
      <div className="liquidity-stat-mod">
        <span className="liquidity-stat-value-mod">
          {isAddLiquidity ? '$42.8B' : `${formatEther((lpBalance as bigint) || 0n)} LP`}
        </span>
        <span className="liquidity-stat-label-mod">
          {isAddLiquidity ? 'Total Locked' : 'Your Stake'}
        </span>
      </div>
      <div className="liquidity-stat-mod">
        <span className="liquidity-stat-value-mod">12-48%</span>
        <span className="liquidity-stat-label-mod">APY Range</span>
      </div>
    </div>
  </div>
</div>
    </div>
  </div>
</div>

        {/* Swap Section */}
        <div ref={swapSectionRef} className="section-container">
  <div className="content-container">
    <div className="section-content reverse">
      <div className="swap-description">
        <h2 className="gradient-text">Token Swaps</h2>
        <p className="glow-text">
          <span className="flash-icon">⚡</span> Execute zero-gas, cross-chain swaps with <> </>
          <span >Flare-verified pricing</span> that aggregates liquidity from
          15+ DEXs. Our smart order routing dynamically calculates optimal paths
          to deliver <span className="highlight">0.1% better rates</span> than leading aggregators, with
          <span className="highlight">slippage protection up to $50k volumes</span>. Each trade is
          cryptographically verified against Flare's decentralized oracle network
          for <span className="highlight">front-running resistance</span> and MEV protection.
        </p>
        <div className="stats-grid">
          <div className="stat-item pulse-glow">
            <div className="stat-value">$1.2B</div>
            <div className="stat-label">24h Volume</div>
          </div>
          <div className="stat-item pulse-glow">
            <div className="stat-value">0.05%</div>
            <div className="stat-label">Average Fee</div>
          </div>
          <div className="stat-item pulse-glow">
            <div className="stat-value">12s</div>
            <div className="stat-label">Avg. Swap Time</div>
          </div>
        </div>
      </div>

      <div className="swap-card section-card neo-glass">
        <div className="card-content">
          <h2 className="card-title">Swap Tokens</h2>
          <p className="card-subtitle">Get the best rates across DeFi</p>

          <div className="card-actions">
            <div className="swap-input-container neo-inset">
              <input
                type="number"
                placeholder="0.0"
                className="swap-amount-input"
                value={swapFromAmount}
                onChange={(e) => setSwapFromAmount(e.target.value)}
              />
              <div className="token-select-wrapper">
                <select
                  className="token-select-right"
                  value={selectedTokenA}
                  onChange={(e) => setSelectedTokenA(e.target.value as Address)}
                >
                  {TOKEN_LIST.map(token => (
                    <option key={token.address} value={token.address}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
                <div className={`token-icon ${getTokenSymbol(selectedTokenA).toLowerCase()}-icon`} />
              </div>
            </div>

            <div className="swap-arrow-container">
              <button 
                className="swap-arrow-circle"
                onClick={() => {
                  const temp = selectedTokenA;
                  setSelectedTokenA(selectedTokenB);
                  setSelectedTokenB(temp);
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="swap-arrow-icon">
                  <path d="M12 4V20M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="swap-input-container neo-inset">
              <input
                type="number"
                placeholder="0.0"
                className="swap-amount-input"
                value={swapToAmount}
                readOnly
              />
              <div className="token-select-wrapper">
                <select
                  className="token-select-right"
                  value={selectedTokenB}
                  onChange={(e) => setSelectedTokenB(e.target.value as Address)}
                >
                  {TOKEN_LIST.map(token => (
                    <option key={token.address} value={token.address}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
                <div className={`token-icon ${getTokenSymbol(selectedTokenB).toLowerCase()}-icon`} />
              </div>
            </div>

            <button
              className="action-btn pulse"
              onClick={handleSwapNew}
              disabled={isCalculating || !swapFromAmount}
            >
              {isCalculating ? <span>Calculating...</span> : <span>Swap Now</span>}
            </button>
          </div>

          <div className="rate-info">
            <span className="rate-label">Best rate:</span>
            <span className="rate-value">
              1 {getTokenSymbol(selectedTokenA)} = 
              {swapToAmount && swapFromAmount 
                ? (Number(swapToAmount)/Number(swapFromAmount)).toFixed(4)
                : '0.0000'} {getTokenSymbol(selectedTokenB)}
            </span>
          </div>

          <div className="card-stats">
            <div className="stat">
              <span className="value">0.05%</span>
              <span className="label">Fee</span>
            </div>
            <div className="stat">
              <span className="value">$1.2B</span>
              <span className="label">Volume 24h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Prediction Section */}


        {/* // Inside your component's return statement: */}
        <div ref={predictionSectionRef} className="section-container full-width">
          <div className="content-container">
            <h2 className="section-title">Prediction Markets</h2>
            <p className="section-subtitle">Trade on future price movements with AI-powered insights</p>

            <div className="prediction-cards-container">
              <PredictionCard
                asset="BTC"
                currentPrice={prices.BTC}
                priceChange={2.4}
                timeRemaining={deadlines.BTC}
                progress={30}
                volume={volumes.BTC}
              />

              <PredictionCard
                asset="FLR"
                currentPrice={prices.FLR}
                priceChange={1.8}
                timeRemaining={deadlines.FLR}
                progress={40}
                volume={volumes.FLR}
              />

              <PredictionCard
                asset="DOGE"
                currentPrice={prices.DOGE}
                priceChange={-3.2}
                timeRemaining={deadlines.DOGE}
                progress={25}
                volume={volumes.DOGE}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}