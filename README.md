# SomeBabylonGame
Ceci est un jeu plateforme action dévéloppé pour le concours **Games on Web 2022**.

## Synopsis
Après t'avoir transformé en cyborg et utilisé pour faire du mal, Dr.Evil a décidé de se débarrasser de toi...  
Tu survis ton exécution et reprend le contrôle de ton corps...  
Maintenant libéré de la manipulation de Dr.Evil, il est temps pour toi de mettre fin à ses plans maléfiques!

## Contrôles
* **flèches directionnelles** pour bouger.
* **espace** pour sauter (garder appuyé pour sauter plus en haut).
* **e** pour attaquer.
* **echap** pour pauser le jeu.

## Démo
Jouez au jeu [ici](https://saad-ahmed98.github.io/SomeBabylonGame/).

## Code
* Points forts :
  * Les collisions étaient initialement calculées avec un moteur physique. Nous avons changé cela par la suite et faisons maintenant tout cela à la main pour permettre d'effectuer des mouvements sur les plateformes qui ne sont pas réalistes et donc impossibles avec un moteur.
  * Pour l'écran de chargement, nous ne pouvions pas le modifier en JS. D'après la doc de BabylonJS, il faut implementer une interface ce qui n'est pas faisable sans TypeScript. Nous avons donc repris le code source de l'écran de chargement de BabylonJS et nous l'avons réécrit manuellement avec nos modifications (voir LoadingScreen.js).
* Points faibles :
  * Notre modèle du personnage principal possède déjà une épée que nous cachons tant que le joueur ne la trouve pas. Nous avons fait cela car nous n'arrivions pas à lier la mesh separée de l'épée au modèle du personnage et lui faire suivre les bons mouvements.
  * Pour pallier les problèmes de framerate qui changent la vitesse du joueur, nous avons une variable qui modifie la vitesse des mouvements par rapport aux fps. Cela est possible grâce au [RollingAverage](https://doc.babylonjs.com/typedoc/classes/babylon.rollingaverage). Cela marche partiellement car moins on a de fps moins c'est précis rendant les sauts plus hauts de ce qu'il faut passé un certain seuil de fps.


## Sources
* Modèles:
  * **Personnage principal**: [Kenney Animated Characters 2](https://www.kenney.nl/assets/animated-characters-2)
  * **Ennemies**: [Quaternius Animated Mech Pack](https://quaternius.com/packs/animatedmech.html)
  * **Elements de décor LVL1**: [Quaternius Ultimate Buildings Pack](https://quaternius.com/packs/ultimatetexturedbuildings.html)
  * **Elements de décor LVL2**: [Quaternius Modular Dungeon Pack](https://quaternius.com/packs/medievaldungeon.html)
  * **Elements de décor LVL3/LVL5**: [Quaternius Ultimate Modular Sci-fi Pack](https://quaternius.com/packs/ultimatemodularscifi.html)
* Animations personnage principal : [Mixamo](https://www.mixamo.com)
* Bruitages : 
  * **Personnage principal**: [Metin2 Warrior SFX](https://www.youtube.com/watch?v=MiXP_QCqp3E)
  * **Ennemies**: [The robot voice toolkit](https://www.soundsnap.com/tags/the_robot_voice_toolkit)
  * **Ascenseur LVL3**: [Utility Elevator CI](https://www.videvo.net/sound-effect/utility-elevator-cl-pe1023207/260600/)
  * **Alerte LVL3**: [Alert Siren SFX](https://www.youtube.com/watch?v=aeRDVOUy7dY)
  * **Laser ennemi**: Star Wars laser SFX
  * **Attaque épée laser**: [Lightsaber sounds swing01](https://www.soundboard.com/sb/sound/931006)
  * **Téléportation**: ??? (nous avons perdu la source)
* Musique:
  * **Ménu**: [Girls' Frontline - Faith of Blood](https://youtu.be/inkmCk9ajFU)
  * **LVL1**: [Girls' Frontline - Illusory Peace](https://youtu.be/Pjf1bwdDoVs)
  * **LVL2**: [Girls' Frontline - Wolf and Owl](https://youtu.be/HWoG3aUOiY0)
  * **LVL3**: [Girls' Frontline - Cat and Mouse](https://youtu.be/Nu9hL9QZ9ik)
  * **LVL4**: [Girls' Frontline - Relative Behaviour](https://youtu.be/GUGG1s_CtSg)
  * **LVL5**: [Girls' Frontline - Deep Dive Boss (instrumental)](https://youtu.be/b7KHWeDV2zI)
* Tutos code:
  * **Barre vie ennemies**: https://www.babylonjs-playground.com/#3HQSB#4
  * **Afficher FPS**: https://forum.babylonjs.com/t/how-to-display-fps/7395
  * **Animations sur Blender**: https://youtu.be/vO4tQMCW3AQ

## Membres de l'équipe
* Saad el din Ahmed
* Yessine Ben el bey
* Wajdi Gaiech
