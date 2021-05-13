const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchian',()=>{
    let blockchain,newChain,orignalChain;

    beforeEach(()=> {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        orignalChain=blockchain.chain;
    });

    it('contains a `chain` array instance', ()=>{
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with a genesis Block', ()=> {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain',()=>{
        const newData='foo-data';
        blockchain.addBlock({data: newData});

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isVlaidChain()',()=>{
        describe('when the blockchain doesnt start with genesis block',()=>{
            it('should return false',()=>{
                blockchain.chain[0]= { data: 'fake-genesis'};

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('when the chain starts with a genesis block and have multiple blocks',()=>{
            beforeEach(()=>{
                blockchain.addBlock({ data: 'retriever'});
                blockchain.addBlock({ data: 'bull dog'});
                blockchain.addBlock({ data: 'pibull'});
            });

            describe('lasthash reference has changed',()=>{
                it('should return false',()=>{
                  
                    blockchain.chain[2].lastHash='broken lasthash';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);

                });
            });

            describe('and the chain contains a block with invalid field',()=>{
                it('should return false',()=>{
                    
                    blockchain.chain[2].data='some-bad-and-evil-data';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chian does not contain any invalid block',()=>{
                it('should return true', ()=>{
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);

                });
            });
        });
    });

    describe('replaceChain()',()=>{
       /* let errorMock,logMock;
        beforeEach(()=>{
            errorMock=jest.fn();
            logMock=jest.fn();

            global.console.error=errorMock;
            global.console.log=logMock;
        });
*/
        describe('when the new chain is not longer', ()=>{
            beforeEach(()=>{
                newChain.chain[0]={ new: 'chain'};

                blockchain.replaceChain=newChain.chain;
            });
            it('does not replace the chain',()=>{
                

                expect(blockchain.chain).toEqual(orignalChain);

            });
  /*          it('logs an error',()=>{
                expect(errorMock).toHaveBeenCalled();
            });
        */    });

        describe('when the chain is longer', ()=>{
            beforeEach(()=>{
                newChain.addBlock({ data: 'retriever'});
                newChain.addBlock({ data: 'bull dog'});
                newChain.addBlock({ data: 'pibull'});
            });
            describe('when the chain is invalid',()=>{
                it('does not replace the chain',()=>{
                    newChain.chain[2].hash='evil-hash';
                    blockchain.replaceChain(newChain.chain);

                    expect(blockchain.chain).toEqual(orignalChain);

                });
            });

            describe('when the chain is valid',()=>{
                it('does replace the chain',()=>{
                    blockchain.replaceChain(newChain.chain);

                    expect(blockchain.chain).toEqual(newChain.chain);

                });
            });
        });
    });

});