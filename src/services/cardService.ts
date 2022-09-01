import * as cardRepository from '../repositories/cardRepository'


export async function getAllCards () {

    const allCards = await cardRepository.find();

    return allCards;
}