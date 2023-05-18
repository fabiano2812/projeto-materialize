
name := """projeto-materialize"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.11.12"

libraryDependencies ++= Seq(
  javaJdbc,
  filters,
  javaJpa.exclude("org.hibernate.javax.persistence", "hibernate-jpa-2.0-api"),
  cache,
  javaWs,
  "org.hibernate" % "hibernate-entitymanager" % "4.3.10.Final",
  "org.hibernate" % "hibernate-envers" % "4.3.10.Final",
  "org.postgresql" % "postgresql" % "42.2.2",
  "com.lowagie" % "itext" % "2.1.7",
  "net.sf.jasperreports" % "jasperreports" % "6.4.0",
  "com.thoughtworks.xstream" % "xstream" % "1.4.11.1"
)

resolvers ++= Seq(
  "Local Maven Repository" at "file:///C:/Users/Agium/.m2/repository",
  "Jasper" at "http://jaspersoft.artifactoryonline.com/jaspersoft/third-party-ce-artifacts/",
  "JBoss 3rd-party" at "https://repository.jboss.org/nexus/content/repositories/thirdparty-releases/"
)

// Play provides two styles of routers, one expects its actions to be injected, the
// other, legacy style, accesses its actions statically.
routesGenerator := InjectedRoutesGenerator

//nao cria jar de external sources
PlayKeys.externalizeResources := false

//pipelineStages := Seq(uglify)

offline:=true

playEnhancerEnabled := false

EclipseKeys.preTasks := Seq(compile in Compile)

