<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="xml" />
<xsl:template match="/">
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <title>Cypress : Simulations</title>
      <link rel="stylesheet" type="text/css" href="../css/simulations.css"></link>
    </head>
    <body>
      <div id="container">
        <h1>Simulations</h1>
          <div id="simulations">
          <xsl:for-each select="simulations/category">
            <div class="category" id="{@path}">
              <div class="category-name">
                <xsl:value-of select="name" />
              </div>
              <xsl:for-each select="subcategory">
                <div class="subcategory" id="{../@path}/{@path}">
                  <div class="subcategory-name">
                    <xsl:value-of select="name" />
                  </div>
                  <xsl:for-each select="simulation">
                    <div class="simulation" id="{../../@path}/{../@path}/{@path}">
                      <div class="simulation-name" onclick="ep='{../../@path}/{../@path}/{@path}'; localStorage.setItem('description', document.getElementById(ep+'/description').innerHTML); window.location='simulation.html?'+ep;">
                        <xsl:value-of select="name" />
                      </div>
                      <div class="simulation-tags">
                        Tags: 
                        <xsl:for-each select="tagset/tag">
                        <div class="tag">
                          <xsl:value-of select="." />
                        </div>
                        </xsl:for-each>
                      </div>
                      <div class="description" id="{../../@path}/{../@path}/{@path}/description">
                        <xsl:value-of select="description" />
                        <div class="equations">
                          <xsl:for-each select="equations/equation">
                            <div class="equation">
                              [latex]<xsl:value-of select="." />[/latex]
                            </div>
                          </xsl:for-each>
                        </div>
                      </div>
                    </div>
                  </xsl:for-each>
                </div>
              </xsl:for-each>
            </div>
          </xsl:for-each>
        </div>
      </div>
    </body>
  </html>
</xsl:template>

</xsl:stylesheet>
