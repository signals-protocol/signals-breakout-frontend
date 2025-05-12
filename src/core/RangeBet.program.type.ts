export type RangeBetProgram = {
    version: '0.1.0';
    name: 'range_bet_program';
    instructions: [
      {
        name: 'buyTokens';
        accounts: [
          { name: 'user'; isMut: true; isSigner: true },
          { name: 'market'; isMut: true },
          { name: 'userPosition'; isMut: true },
          { name: 'userTokenAccount'; isMut: true },
          { name: 'vault'; isMut: true },
          { name: 'tokenProgram' },
          { name: 'systemProgram' },
          { name: 'rent' }
        ];
        args: [
          { name: '_market_id'; type: 'u64' },
          { name: 'bin_indices'; type: { vec: 'u16' } },
          { name: 'amounts'; type: { vec: 'u64' } },
          { name: 'max_collateral'; type: 'u64' }
        ];
      },
      // ... 생략 (총 12개 instruction 있음)
    ];
    accounts: [
      { name: 'Market' },
      { name: 'ProgramState' },
      { name: 'UserMarketPosition' }
    ];
    types: [
      {
        name: 'BinBal';
        type: {
          kind: 'struct';
          fields: [
            { name: 'index'; type: 'u16' },
            { name: 'amount'; type: 'u64' }
          ];
        };
      },
      {
        name: 'Market';
        type: {
          kind: 'struct';
          fields: [ /* active, closed, tick_spacing, ... */ ];
        };
      },
      {
        name: 'ProgramState';
        type: {
          kind: 'struct';
          fields: [ /* owner, market_count, last_closed_market */ ];
        };
      },
      {
        name: 'UserMarketPosition';
        type: {
          kind: 'struct';
          fields: [ /* owner, market_id, bins */ ];
        };
      }
    ];
    errors: [
      { code: 6000; name: 'MarketNotActive'; msg: 'Market is not active' },
      // ... 생략 (6000~6025까지 있음)
    ];
  };
  