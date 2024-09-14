import { TDocument, TArticleAttributes, declOfNum } from '../../AppContext';
import css from './Article.module.css';

function Article(props: {data:TDocument}) {

    const docData = props.data.ok;

    return (
        <div className={css.section_3_document}>
            <div className={css.document_header}>
                <p className={css.document_header_date}>{new Date(docData.issueDate).toLocaleDateString("ru-RU")}</p>
                <a href={docData.url} className={css.document_header_name} target="_blank">{docData.source.name}</a>
            </div>
            <p className={css.document_title}>{docData.title.text}</p>
            <div className={css.tags}>{getTags(docData.attributes)}</div>
            <div className={css.document_img}>
                <img src={getImgSrc(docData.content.markup)} alt={""} className={css.img}/>
            </div>
            <div className={css.document_text}>
                <p className={css.text_main}>{getTextFromMarkup(docData.content.markup)}</p>
            </div>
            <div className={css.document_footer}>
                <a href={docData.url} className={css.document_btn} target="_blank">Читать в источнике</a>
                <p className={css.text_main}>{docData.attributes.wordCount} {declOfNum(docData.attributes.wordCount, ["слово","слова","слов"])}</p>
            </div>
        </div>
    )

}

function getTags(attrs:TArticleAttributes) {

    const a1 = attrs.isTechNews ? <div className={css.rectangle_orange}>Технические новости</div> : '';
    const a2 = attrs.isAnnouncement ? <div className={css.rectangle_orange}>Анонсы и события</div> : '';
    const a3 = attrs.isDigest ? <div className={css.rectangle_orange}>Сводки новостей</div> : '';
    
    return (
        <>{a1}{a2}{a3}</>
    )

}

// примитивно, но текст извлекается
function getTextFromMarkup(xmlString:string):string {
    
    //return xmlString;

    const parser = new DOMParser(); 
    const xmlDocument = parser.parseFromString(xmlString,"application/xml");
    
    const textElements = xmlDocument.querySelectorAll('sentence');
    const textElementsArray = Array.from(textElements);
    return textElementsArray.reduce((result, text) => {  
        if (text.textContent !== '') {
            const pattern1 = /&.*?;/g;
            result += `${text.textContent?.replace(pattern1, " ")} `;
        }
        const pattern2 = /<.*?>/g;
        const result1 = result.replace(pattern2, " ");
        return result1;
      }, '');
}

// так же и с картинками, ну нет их URL в другом виде
function getImgSrc(xmlString:string):string {
    
    const pattern = /&lt;img src="(.*?)"&gt;/;
    const found = xmlString.match(pattern);
    return found ? found[1] : "/img/document_img.png";
}
   
export default Article;