const Block = require("./block");
const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

describe('Block',()=>{
    const timeStamp='a-date';
    const lastHash='foo-hash';
    const hash='bar-hash';
    const data=['blockchain,data'];
    const block=new Block({ timeStamp,lastHash,hash,data });

    it('has all the properties',()=>{
        expect(block.timeStamp).toEqual(timeStamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);

    });

    describe('genesis()', ()=>{
        const genesisBlock= Block.genesis();

        it('returns a block instance', ()=> {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns the gensis data', ()=>{
            expect(genesisBlock).toEqual( GENESIS_DATA);
        });
    });

    describe('mineBlock()', ()=> {
        const lastBlock=Block.genesis();
        const data='mined-data';

        const minedBlock=Block.mineBlock({ lastBlock,data });

        it('returns a block instance', ()=> {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the `lasthash` to be the `hash` of lastBlock', ()=> {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data`',()=> {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets the `timeStamp`',()=> {
            expect(minedBlock.timeStamp).not.toEqual(undefined);
        });

        it('creates a SHA-256 `hash` based on proper inpts', ()=>{
            expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timeStamp, lastBlock.hash, data));
        });
    });
});