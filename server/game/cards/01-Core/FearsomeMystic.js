const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class FearsomeMystic extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.game.currentConflict && this.game.currentConflict.hasElement('air'),
            effect: ability.effects.modifyGlory(2)
        });
        this.action({
            title: 'Remove fate from characters',
            condition: () => this.isParticipating() && this.controller.opponent && this.controller.opponent.cardsInPlay.any(card => card.isParticipating() && card.fate > 0),
            handler: context => {
                this.game.addMessage('{0} uses {1} to remove 1 fate from all opposing characters with lower glory than her', this.controller, this);
                let cards = this.game.findAnyCardsInPlay(card => {
                    return (card.isParticipating() && 
                            card.controller !== this.controller && 
                            card.getGlory() < this.getGlory() && 
                            card.fate > 0 &&
                            card.allowGameAction('removeFate', context));
                });
                this.game.raiseMultipleEvents(_.map(cards, card => {
                    return {
                        name: 'onCardRemoveFate',
                        params: { card: card, fate: 1 }
                    };
                }));
            }
        });
    }
}

FearsomeMystic.id = 'fearsome-mystic';

module.exports = FearsomeMystic;
