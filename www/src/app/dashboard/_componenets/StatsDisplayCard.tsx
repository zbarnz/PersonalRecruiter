import { Paper, Text } from "@mantine/core";
import styles from "./StatsDisplayCard.module.css"

type StatsDisplayCardProps = {
    statText: string,
    statNumber: number,
    bottomText: string,

}
export default function StatsDisplayCard({statText, statNumber, bottomText}: StatsDisplayCardProps) { 

    return (
        <Paper className={styles.statsDisplayCard} shadow="xl" radius="lg" withBorder p="xl">
            <div className={styles.top}>
                <span>{statText}:</span>
                <span>{statNumber}</span>
            </div>
            
            <div className={styles.bottom}>
                <span>{bottomText}</span>
            </div>
        </Paper>
    )
}
