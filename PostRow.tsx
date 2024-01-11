
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';

export type Author = {
  name: string;
};
export interface PopularArticlesRow {
  articleId: string;
  articleTitle: string;
  authors: [Author];
  thumbnailImage?: string;
  readed: boolean;
  articleLink: string;
  onPressed: (articleId: string, articleLink: string) => void;
}

const PopularArticlesRow: React.FC<PopularArticlesRow> = ({
  articleId,
  articleTitle,
  authors,
  thumbnailImage,
  readed,
  articleLink,
  onPressed,
}) => {
  const shouldCardBeDark = true; // Test A/B

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: Metrics.SPACING_MEDIUM,
      marginBottom: Metrics.SPACING_XS,
      backgroundColor: shouldCardBeDark ? Color.Black : Color.White,
      borderRadius: Metrics.standardBorderRadius,
      padding: Metrics.SPACING_XS,
    },
    articleTitle: {
      color: shouldCardBeDark ? Color.White : Color.Black,
      marginTop: Metrics.SPACING_XS,
    },
    authorsContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginVertical: Metrics.SPACING_XS,
      justifyContent: 'space-between',
    },
    authorName: {
      color: shouldCardBeDark ? Color.White : Color.Black,
    },
    imageStyle: {
      height: Metrics.images.xxl,
      borderRadius: Metrics.largeBorderRadius,
    },
    readContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
    },
  });

  const onPressArticle = useCallback(() => onPressed(articleId, articleLink), [
    articleId,
    onPressed,
    articleLink,
  ]);
  const image = { uri: thumbnailImage };
  return (
    <TouchableOpacity
      onPress={onPressArticle}
    >
      <View style={styles.container}>
        <Choose>
          <When condition={!!thumbnailImage}>
            <Image
              automationNodeName="ArticleImage"
              style={styles.imageStyle}
              resizeMode="cover"
              source={image}
            />
          </When>
          <Otherwise>
            <Text type={TextType.TitleSm}>{thumbnailImage}</NWText>
          </Otherwise>
        </Choose>
        <Text
          automationNodeName="ArticleName"
          style={styles.articleTitle}
          type={TextType.TitleXs}
        >
          {articleTitle}
        </Text>
        <View style={styles.authorsContainer}>
          {authors.map(author => {
            return (
              <Text
                automationNodeName={`AuthorName-${author.name}`}
                style={styles.authorName}
                type={TextType.Legal}
              >
                {author.name}
              </Text>
            );
          })}
        </View>
        <If condition={readed}>
          <View style={styles.readContainer}>
            <IonIcon
              automationNodeName="ArticleReadIcon"
              name="checkmark-sharp"
              size={Metrics.icons.small}
              color={Color.Green200}
            />
            <Text
              automationNodeName="ArticleRead"
              color={Color.Green200}
              type={TextType.Legal}
            >
              Already read
            </Text>
          </View>
        </If>
      </View>
    </TouchableOpacity>
  );
};

export default PopularArticlesRow;
