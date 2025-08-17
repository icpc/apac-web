import styles from '@/app/_styles/markdown-styles.module.css';

type Props = {
    content: string;
};

export function Content({
    content,
}: Props) {
    return (
        <section className={styles['markdown-root']}>
            <div className={styles.markdown + " markdown"} dangerouslySetInnerHTML={{ __html: content }}>
            </div>
        </section>
    );
}