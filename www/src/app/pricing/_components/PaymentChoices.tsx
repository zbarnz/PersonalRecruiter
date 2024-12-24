import classes from '../_components/Payment.module.css'
import { Card, Text, Button, Stack, Badge } from '@mantine/core';
type PaymentCardProps = {
    planTitle: string;
    creditAmount: number;
    price: number;
    themeColor: string
}

export function PaymentCard({planTitle, creditAmount, price, themeColor}: PaymentCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 300, height: 375 }} className={classes.container} >
        <div className={classes.upperBorder} style={{backgroundColor: themeColor}} />
      <Stack align="center">
        <Text className={classes.planTitle}>
          {planTitle}
        </Text>
        <Badge color={themeColor} variant="light" size="lg">
          {creditAmount} credits
        </Badge>
        <div className={classes.priceRow}>
            <Text className={classes.price}>${price}</Text>
            <Text className={classes.priceMonth} size="sm">/mo</Text>
        </div>
        
        <Button radius="md" color={themeColor} className={classes.purchaseButton}>
          Purchase
        </Button>
      </Stack>
    </Card>
  );
}



export function PaymentChoices() {
  return (
    <>
    <PaymentCard planTitle='BASIC' creditAmount={100} price={10} themeColor='#17d43a'/>
    <PaymentCard planTitle='PRO' creditAmount={500} price={50} themeColor='#41adf0'/>
    </>
  );
}