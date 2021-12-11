import MythicKey from '../../../../../../../main/js/ch/epfl/rio/model/objects/MythicKey'

const assertC = require('assert');

describe('Simple Math Test', () => {
    it('should return 2', () => {
        assertC.equal(1 + 1, 2);
    });
    it('should return 9', () => {
        assertC.equal(3 * 3, 9);
    });
    it('should import modules correctly', function() {
        //let key: InstanceType<typeof MythicKey> = new MythicKey('nw+21');
        let key: MythicKey = new MythicKey('nw+21');
        assertC.equal(key.getLevel(), 21);
    });
});
