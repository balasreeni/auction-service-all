import AWS from 'aws-sdk';
import { closeAuction } from '../lib/closeAuction';
import { getEndedAuctions } from '../lib/getEndedAuctions' ;
import createError from 'http-errors' ;

const dynamodb = new AWS.DynamoDB.DocumentClient() ;

async function processAuctions(event, context) 
{
    try {
        const auctionsToClose = await getEndedAuctions() ;

        const closePromises = auctionsToClose.map(auction => closeAuction(auction)) ;
        
        await Promise.all(closePromises) ;
        return { closed: closePromises.length} ;   
    }
    catch(error) {
        console.error(error) ;
        throw new createError.InternalServerError(error);
    }
}

export const handler = processAuctions ;