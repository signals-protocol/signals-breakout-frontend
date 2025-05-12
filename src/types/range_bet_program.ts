/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/range_bet_program.json`.
 */
export type RangeBetProgram = {
  "address": "97i8BgDJG6yZggN2Di5UnERs6X5PqYqnkSvkMdvw1d5J",
  "metadata": {
    "name": "rangeBetProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "activateMarket",
      "discriminator": [
        10,
        26,
        197,
        116,
        113,
        99,
        72,
        89
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "programState",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  97,
                  110,
                  103,
                  101,
                  45,
                  98,
                  101,
                  116,
                  45,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "marketId",
          "type": "u64"
        },
        {
          "name": "active",
          "type": "bool"
        }
      ]
    },
    {
      "name": "buyTokens",
      "discriminator": [
        189,
        21,
        230,
        133,
        247,
        2,
        110,
        42
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "market",
          "docs": [
            "Market account"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        },
        {
          "name": "userPosition",
          "docs": [
            "User position"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        },
        {
          "name": "userTokenAccount",
          "docs": [
            "User token account"
          ],
          "writable": true
        },
        {
          "name": "vault",
          "docs": [
            "Market Vault account"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "marketId",
          "type": "u64"
        },
        {
          "name": "binIndices",
          "type": {
            "vec": "u16"
          }
        },
        {
          "name": "amounts",
          "type": {
            "vec": "u64"
          }
        },
        {
          "name": "maxCollateral",
          "type": "u64"
        }
      ]
    },
    {
      "name": "calculateBinCost",
      "discriminator": [
        210,
        254,
        252,
        188,
        111,
        254,
        45,
        70
      ],
      "accounts": [
        {
          "name": "market",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "marketId",
          "type": "u64"
        },
        {
          "name": "index",
          "type": "u16"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ],
      "returns": "u64"
    },
    {
      "name": "calculateBinSellCost",
      "discriminator": [
        108,
        221,
        56,
        47,
        163,
        135,
        221,
        9
      ],
      "accounts": [
        {
          "name": "market",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "marketId",
          "type": "u64"
        },
        {
          "name": "index",
          "type": "u16"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ],
      "returns": "u64"
    },
    {
      "name": "calculateXForBin",
      "discriminator": [
        175,
        157,
        157,
        245,
        198,
        66,
        76,
        112
      ],
      "accounts": [
        {
          "name": "market",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "marketId",
          "type": "u64"
        },
        {
          "name": "index",
          "type": "u16"
        },
        {
          "name": "cost",
          "type": "u64"
        }
      ],
      "returns": "u64"
    },
    {
      "name": "claimReward",
      "discriminator": [
        149,
        95,
        181,
        242,
        94,
        90,
        158,
        162
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "market",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user_position.market_id",
                "account": "userMarketPosition"
              }
            ]
          }
        },
        {
          "name": "userPosition",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "user_position.market_id",
                "account": "userMarketPosition"
              }
            ]
          }
        },
        {
          "name": "userTokenAccount",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "vaultAuthority",
          "docs": [
            "Vault authority PDA (program signing PDA)"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user_position.market_id",
                "account": "userMarketPosition"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "closeMarket",
      "discriminator": [
        88,
        154,
        248,
        186,
        48,
        14,
        123,
        244
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "programState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  97,
                  110,
                  103,
                  101,
                  45,
                  98,
                  101,
                  116,
                  45,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "marketId",
          "type": "u64"
        },
        {
          "name": "winningBin",
          "type": "u16"
        }
      ]
    },
    {
      "name": "createMarket",
      "discriminator": [
        103,
        226,
        97,
        235,
        200,
        188,
        251,
        254
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "programState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  97,
                  110,
                  103,
                  101,
                  45,
                  98,
                  101,
                  116,
                  45,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "market",
          "docs": [
            "Account to store market information to be created"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "program_state.market_count",
                "account": "programState"
              }
            ]
          }
        },
        {
          "name": "collateralMint",
          "docs": [
            "Collateral token Mint"
          ]
        },
        {
          "name": "vault",
          "docs": [
            "Market's Vault account (stores collateral)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultAuthority"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "collateralMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "vaultAuthority",
          "docs": [
            "Vault authority PDA (program-signing PDA)"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "program_state.market_count",
                "account": "programState"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tickSpacing",
          "type": "u32"
        },
        {
          "name": "minTick",
          "type": "i64"
        },
        {
          "name": "maxTick",
          "type": "i64"
        },
        {
          "name": "closeTs",
          "type": "i64"
        }
      ]
    },
    {
      "name": "initializeProgram",
      "discriminator": [
        176,
        107,
        205,
        168,
        24,
        157,
        175,
        103
      ],
      "accounts": [
        {
          "name": "initializer",
          "writable": true,
          "signer": true
        },
        {
          "name": "programState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  97,
                  110,
                  103,
                  101,
                  45,
                  98,
                  101,
                  116,
                  45,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "transferPosition",
      "discriminator": [
        139,
        130,
        102,
        147,
        135,
        77,
        113,
        222
      ],
      "accounts": [
        {
          "name": "fromUser",
          "writable": true,
          "signer": true
        },
        {
          "name": "toUser",
          "docs": [
            "Recipient of the position transfer"
          ]
        },
        {
          "name": "market",
          "docs": [
            "Market information"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        },
        {
          "name": "fromPosition",
          "docs": [
            "Sender's position"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "fromUser"
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        },
        {
          "name": "toPosition",
          "docs": [
            "Recipient position (created if doesn't exist)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "toUser"
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "marketId",
          "type": "u64"
        },
        {
          "name": "binIndices",
          "type": {
            "vec": "u16"
          }
        },
        {
          "name": "amounts",
          "type": {
            "vec": "u64"
          }
        }
      ]
    },
    {
      "name": "withdrawCollateral",
      "discriminator": [
        115,
        135,
        168,
        106,
        139,
        214,
        138,
        150
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "programState",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  97,
                  110,
                  103,
                  101,
                  45,
                  98,
                  101,
                  116,
                  45,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        },
        {
          "name": "ownerTokenAccount",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "vaultAuthority",
          "docs": [
            "Vault authority PDA (program-signing PDA)"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "marketId",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "market",
      "discriminator": [
        219,
        190,
        213,
        55,
        0,
        227,
        198,
        154
      ]
    },
    {
      "name": "programState",
      "discriminator": [
        77,
        209,
        137,
        229,
        149,
        67,
        167,
        230
      ]
    },
    {
      "name": "userMarketPosition",
      "discriminator": [
        173,
        173,
        210,
        19,
        141,
        85,
        211,
        21
      ]
    }
  ],
  "events": [
    {
      "name": "collateralOut",
      "discriminator": [
        51,
        132,
        103,
        227,
        150,
        63,
        59,
        219
      ]
    },
    {
      "name": "marketClosed",
      "discriminator": [
        86,
        91,
        119,
        43,
        94,
        0,
        217,
        113
      ]
    },
    {
      "name": "marketCreated",
      "discriminator": [
        88,
        184,
        130,
        231,
        226,
        84,
        6,
        58
      ]
    },
    {
      "name": "rewardClaimed",
      "discriminator": [
        49,
        28,
        87,
        84,
        158,
        48,
        229,
        175
      ]
    },
    {
      "name": "tokensBought",
      "discriminator": [
        151,
        148,
        173,
        226,
        128,
        30,
        249,
        190
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "marketNotActive",
      "msg": "Market is not active"
    },
    {
      "code": 6001,
      "name": "marketClosed",
      "msg": "Market is closed"
    },
    {
      "code": 6002,
      "name": "invalidTickSpacing",
      "msg": "Tick spacing must be positive"
    },
    {
      "code": 6003,
      "name": "minTickNotMultiple",
      "msg": "Min tick must be a multiple of tick spacing"
    },
    {
      "code": 6004,
      "name": "maxTickNotMultiple",
      "msg": "Max tick must be a multiple of tick spacing"
    },
    {
      "code": 6005,
      "name": "minTickGreaterThanMax",
      "msg": "Min tick must be less than max tick"
    },
    {
      "code": 6006,
      "name": "binIndexOutOfRange",
      "msg": "Bin index out of range"
    },
    {
      "code": 6007,
      "name": "arrayLengthMismatch",
      "msg": "Array length mismatch"
    },
    {
      "code": 6008,
      "name": "noTokensToBuy",
      "msg": "Must bet on at least one bin"
    },
    {
      "code": 6009,
      "name": "costExceedsMaxCollateral",
      "msg": "Cost exceeds maximum collateral"
    },
    {
      "code": 6010,
      "name": "marketIsNotClosed",
      "msg": "Market is not closed"
    },
    {
      "code": 6011,
      "name": "notWinningBin",
      "msg": "Not a winning bin"
    },
    {
      "code": 6012,
      "name": "noTokensToClaim",
      "msg": "No tokens to claim"
    },
    {
      "code": 6013,
      "name": "noCollateralToWithdraw",
      "msg": "No collateral to withdraw"
    },
    {
      "code": 6014,
      "name": "insufficientTokensToTransfer",
      "msg": "Insufficient balance"
    },
    {
      "code": 6015,
      "name": "mathOverflow",
      "msg": "Math overflow occurred"
    },
    {
      "code": 6016,
      "name": "mathUnderflow",
      "msg": "Math underflow occurred"
    },
    {
      "code": 6017,
      "name": "cannotSellMoreThanBin",
      "msg": "Cannot sell more tokens than available in bin"
    },
    {
      "code": 6018,
      "name": "cannotSellMoreThanSupply",
      "msg": "Cannot sell more tokens than total supply"
    },
    {
      "code": 6019,
      "name": "cannotSellEntireSupply",
      "msg": "Cannot sell entire market supply"
    },
    {
      "code": 6020,
      "name": "sellCalculationUnderflow",
      "msg": "Sell calculation underflow"
    },
    {
      "code": 6021,
      "name": "ownerOnly",
      "msg": "Owner only function"
    },
    {
      "code": 6022,
      "name": "incorrectMarketOrderForClosing",
      "msg": "Markets must be closed in sequential order"
    },
    {
      "code": 6023,
      "name": "cannotTransferToSelf",
      "msg": "Cannot transfer to self"
    },
    {
      "code": 6024,
      "name": "cannotSellFromEmptyBin",
      "msg": "Cannot sell tokens from empty bin"
    },
    {
      "code": 6025,
      "name": "invalidBinState",
      "msg": "Bin token quantity cannot be greater than total token quantity"
    }
  ],
  "types": [
    {
      "name": "binBal",
      "docs": [
        "BinBal structure (stored within user position)"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "index",
            "type": "u16"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "collateralOut",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "to",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "market",
      "docs": [
        "Market state structure"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "closed",
            "type": "bool"
          },
          {
            "name": "tickSpacing",
            "type": "u32"
          },
          {
            "name": "minTick",
            "type": "i64"
          },
          {
            "name": "maxTick",
            "type": "i64"
          },
          {
            "name": "tTotal",
            "type": "u64"
          },
          {
            "name": "collateralBalance",
            "type": "u64"
          },
          {
            "name": "winningBin",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "openTs",
            "type": "i64"
          },
          {
            "name": "closeTs",
            "type": "i64"
          },
          {
            "name": "bins",
            "type": {
              "vec": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "marketClosed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "marketId",
            "type": "u64"
          },
          {
            "name": "winningBin",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "marketCreated",
      "docs": [
        "Event definitions"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "marketId",
            "type": "u64"
          },
          {
            "name": "tickSpacing",
            "type": "u32"
          },
          {
            "name": "minTick",
            "type": "i64"
          },
          {
            "name": "maxTick",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "programState",
      "docs": [
        "Global configuration and metadata storage"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "marketCount",
            "type": "u64"
          },
          {
            "name": "lastClosedMarket",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "rewardClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "marketId",
            "type": "u64"
          },
          {
            "name": "claimer",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "tokensBought",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "marketId",
            "type": "u64"
          },
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "totalCost",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userMarketPosition",
      "docs": [
        "User position structure for a specific market"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "marketId",
            "type": "u64"
          },
          {
            "name": "bins",
            "type": {
              "vec": {
                "defined": {
                  "name": "binBal"
                }
              }
            }
          }
        ]
      }
    }
  ]
};

