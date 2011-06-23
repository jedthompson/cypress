<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
    <head>
      <title>Cypress : Simulations</title>
      <link rel="stylesheet" type="text/css" href="../css/simulations.css" />
    </head>
    <body>
      <h1>Simulations</h1>
      <div id="simulations">
        <xsl:for-each select="simulations/category">
          <div class="category">
            <div class="category-name">
              <xsl:value-of select="name" />
            </div>
            <xsl:for-each select="simulation">
              <div class="simulation">
                <div class="simulation-name">
                  <xsl:value-of select="name" />
                </div>
                <div class="simulation-tags">
                  <xsl:for-each select="tagset/tag">
                  <div class="tag">
                    <xsl:value-of select="." />
                  </div>
                  </xsl:for-each>
                </div>
              </div>
            </xsl:for-each>
          </div>
        </xsl:for-each>
      </div>
    </body>
  </html>
</xsl:template>

</xsl:stylesheet>
