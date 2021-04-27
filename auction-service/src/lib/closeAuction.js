import AWS from 'aws-sdk' ;

const dynamodb = new AWS.DynamoDB.DocumentClient() ;

const sqs = new AWS.SQS() ;

export async function closeAuction(auction)
{
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id: auction.id },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeValues: {
            ':status': 'CLOSED',
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        },
    };
    const result = await dynamodb.update(params).promise() ;

    const {title, seller, highestBid } = auction ;
    const {amount, bidder} = highestBid ;

    if (0 == amount) {
        await sqs.sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
                subject: 'No Bids on your auction item :-(',
                recipient: seller,
                body: `Oh No! Your item "${title}" didn't get any bids. Better luck next time!`,
            }),
        }).promise() ;
        return ; 
    }

    const notifySeller = sqs.sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
                subject: 'Your item has been sold',
                recipient: seller,
                body: `Woohoo Your item "${title}" has been sold for $${amount}.`,
            }),
    }).promise() ;
    console.log(`Woohoo Your item "${title}" has been sold for $${amount}`);


    const notifyBidder = sqs.sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
            subject: 'Your won an auction',
            recipient: bidder,
            body: `What a great deal! you got yourself a "${title}" for $${amount}.`,
        }),
    }).promise() ;

    var allpromise = Promise.all([notifySeller, notifyBidder]) ;

    console.log(`Woohoo Your item "${title}" has been sold for $${amount}`);

    return allpromise ;
}