const { TestAdapter, BotContext } = require('botbuilder');
const { DialogSet, DatetimePrompt } =  require('../');
const assert = require('assert');

const beginMessage = { text: `begin`, type: 'message' };
const answerMessage = { text: `Tomorrow at 9am`, type: 'message' };
const invalidMessage = { text: `I am not sure`, type: 'message' };

class TestContext extends BotContext {
    constructor(request) {
        super(new TestAdapter(), request);
        this.sent = undefined;
        this.onSendActivity((context, activities, next) => {
            this.sent = activities;
            context.responded = true;
        });
    }
}

describe('prompts/DatetimePrompt', function() {
    this.timeout(5000);

    it('should call DatetimePrompt using dc.prompt().', function (done) {
        const dialogs = new DialogSet();
        dialogs.add('prompt', new DatetimePrompt());
        dialogs.add('a', [
            function (dc) {
                return dc.prompt('prompt', 'foo');
            },
            function (dc, result) {
                assert(typeof result === 'object');
                done();
            }
        ]);

        const state = {};
        const context = new TestContext(beginMessage);
        const dc = dialogs.createContext(context, state);
        dc.begin('a').then((result) => {
            assert(result && result.active);
            const dc2 = dialogs.createContext(new TestContext(answerMessage), state);
            return dc2.continue();
        });
    });
    
    it('should call DatetimePrompt with custom validator.', function (done) {
        const dialogs = new DialogSet();
        dialogs.add('prompt', new DatetimePrompt((dc, value) => {
            assert(dc);
            return value;
        }));
        dialogs.add('a', [
            function (dc) {
                return dc.prompt('prompt', 'foo');
            }
        ]);

        const state = {};
        const context = new TestContext(beginMessage);
        const dc = dialogs.createContext(context, state);
        dc.begin('a').then((result) => {
            assert(result && result.active);
            const context2 = new TestContext(invalidMessage);
            const dc2 = dialogs.createContext(context2, state);
            return dc2.continue().then((result) => {
                assert(result && result.active);
                assert(context2.sent && context2.sent[0].text === 'foo');
                const dc3 = dialogs.createContext(new TestContext(answerMessage), state);
                return dc3.continue().then((result) => {
                    assert(result && !result.active);
                    assert(typeof result.result === 'object');
                    done();
                });
            });
        });
    });

    it('should send custom retryPrompt.', function (done) {
        const dialogs = new DialogSet();
        dialogs.add('prompt', new DatetimePrompt((dc, value) => {
            assert(dc);
            return value;
        }));
        dialogs.add('a', [
            function (dc) {
                return dc.prompt('prompt', 'foo', { retryPrompt: 'bar' });
            }
        ]);

        const state = {};
        const context = new TestContext(beginMessage);
        const dc = dialogs.createContext(context, state);
        dc.begin('a').then((result) => {
            assert(result && result.active);
            const context2 = new TestContext(invalidMessage);
            const dc2 = dialogs.createContext(context2, state);
            return dc2.continue().then((result) => {
                assert(result && result.active);
                assert(context2.sent && context2.sent[0].text === 'bar');
                const dc3 = dialogs.createContext(new TestContext(answerMessage), state);
                return dc3.continue().then((result) => {
                    assert(result && !result.active);
                    assert(typeof result.result === 'object');
                    done();
                });
            });
        });
    });

    it('should send ignore retryPrompt if validator replies.', function (done) {
        const dialogs = new DialogSet();
        dialogs.add('prompt', new DatetimePrompt((dc, value) => {
            assert(dc);
            if (value === undefined) {
                return dc.context.sendActivity(`bad date`);
            }
            return value;
        }));
        dialogs.add('a', [
            function (dc) {
                return dc.prompt('prompt', 'foo', { retryPrompt: 'bar' });
            }
        ]);

        const state = {};
        const context = new TestContext(beginMessage);
        const dc = dialogs.createContext(context, state);
        dc.begin('a').then((result) => {
            assert(result && result.active);
            const context2 = new TestContext(invalidMessage);
            const dc2 = dialogs.createContext(context2, state);
            return dc2.continue().then((result) => {
                assert(result && result.active);
                assert(context2.sent && context2.sent[0].text === 'bad date');
                const dc3 = dialogs.createContext(new TestContext(answerMessage), state);
                return dc3.continue().then((result) => {
                    assert(result && !result.active);
                    assert(typeof result.result === 'object');
                    done();
                });
            });
        });
    });

    it('should not send any retryPrompt no prompt specified.', function (done) {
        const dialogs = new DialogSet();
        dialogs.add('prompt', new DatetimePrompt((dc, value) => {
            assert(dc);
            return value;
        }));
        dialogs.add('a', [
            function (dc) {
                return dc.begin('prompt');
            }
        ]);

        const state = {};
        const context = new TestContext(beginMessage);
        const dc = dialogs.createContext(context, state);
        dc.begin('a').then((result) => {
            assert(result && result.active);
            const context2 = new TestContext(invalidMessage);
            const dc2 = dialogs.createContext(context2, state);
            return dc2.continue().then((result) => {
                assert(result && result.active);
                assert(!context2.sent);
                const dc3 = dialogs.createContext(new TestContext(answerMessage), state);
                return dc3.continue().then((result) => {
                    assert(result && !result.active);
                    assert(typeof result.result === 'object');
                    done();
                });
            });
        });
    });
});