const response = Object.freeze({
    SUCCESS: { code: 1, message: 'success' },
    SERVER_ERROR: { code: 2, message: 'server error' },
    DECK_EMPTY: { code: 2, message: 'drawpile has no more cards' },
    CLIENT_PARAM_ERROR(msg: string) {
        return { code: 3, message: msg };
    },
    BID_NOT_ALLOWED: { code: 3, message: 'Bid amount should not be less then minimum bet amount' },
    DOUBLE_BID_NOT_ALLOWED: { code: 3, message: 'Double bet not allowed!' },
    INSURANCE_NOT_ALLOWED: { code: 3, message: 'Insurance bet not allowed!' },
    BUSTED: { code: 2, message: 'User is busted' },
    DECLARING_RESULT: { code: 2, message: 'Declaring Result' },
    BLACKJACK: { code: 4, message: 'User has blackjack' },
    SPLIT_NOT_ALLOWED: { code: 4, message: 'Split bet not allowed!' },
    TABLE_NOT_CREATED: { code: 4, message: 'Table not created' },
    TABLE_NOT_UPDATED: { code: 5, message: 'Table not updated' },
    TABLE_NOT_FOUND: { code: 6, message: 'Table not found' },
    TABLE_NOT_RUNNING: { code: 7, message: 'Table is not in running state' },
    PLAYER_NOT_CREATED: { code: 8, message: 'Player not created' },
    PLAYER_NOT_UPDATED: { code: 9, message: 'Player not updated' },
    PLAYER_NOT_FOUND: { code: 10, message: 'Player not found' },
    PLAYER_NOT_ACTIVE: { code: 11, message: 'Player is not in active state' },
    NOT_ENOUGH_CARDS: { code: 12, message: 'Not enough cards' },
    NOT_YOUR_TURN: { code: 13, message: 'Please wait for your turn' },
    WRONG_UNO: { code: 13, message: 'Please press Uno before playing the second last card from the hand' },
    CARD_NOT_IN_HAND: { code: 14, message: 'Card not in hand' },
    EMPTY_HAND: { code: 15, message: 'Hand is empty' },
    CARD_COLOR_REQUIRED: { code: 16, message: 'Card color required when discarding wild card' },
    INVALID_NEXT_CARD_COLOR: { code: 17, message: 'Invalid next card color' },
    TIME_OUT: { code: 17, message: 'Time out' },
});

export default response;
