import Article from "./Article";
import css from './SearchResult.module.css'
import { TDocument } from "../../AppContext";

function ArticlesBlock(props: {articles:TDocument[]}) {
    return (
        <section className={css.section_3}>
            <p className={css.title}>Список документов</p>
            <div className={css.section_3_documents}>
                {props.articles.map((el) => <Article data={el}/>)}
            </div>
        </section>
    )
}

export default ArticlesBlock;