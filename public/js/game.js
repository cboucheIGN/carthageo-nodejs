// /////////////////////////////////////////////////////////////////////
// //////////////////////// Legends of Carthagéo ////////////////////////
// /////////////////////////////////////////////////////////////////////
// // Bienvenue dans le jeu ultime qui vous montrera les meilleurs façons
// // de choisir votre métier en explorant les légendes des différents
// // héros de Carthagéo

// // Fond du jeu
var jaune = (240, 240, 10);
var noir = (0, 0, 0);
var blanc = (255, 255, 255);
var rouge = (240, 10, 10);
//
var tableau = ['/img/Tableau1.png', '/img/Tableau2.png', '/img/Tableau3.png', '/img/Tableau4.png', "/img/Castle_inside.png", "/img/game_over.png"]

//
// # sprite
var sprite_wizard = ['/img/Magier.png'];
var sprite_bat = ['/img/32x32-bat-sprite.png'];
var sprite_knight_walking = ['/img/knight_walk_animation.png'];
var sprite_coffre = ['/img/Coffre.png'];


// fonction de phrase :
// sentence = function(x, y, text, couleur, taille){
//     div
// }

//
// def sens_bat(x, depart_bat_x, sens):
//     # Animation de la Chauve-souris numéro 1
//     # La chauve-souris va vers la gauche
//     if x == depart_bat_x:
//         sens = -1
//
//     # La Chauve-souris va vers la droite
//     if x == depart_bat_x - 200:
//         sens = +1
//     return sens
//
// def animation_bat(anime_bat, sens):
//     # Animation vers la gauche
//     if sens == -1:
//         anime_bat[0] = 96
//         anime_bat[1] = 96
//         if anime_bat[0] == 0:
//             anime_bat[0] = 96
//         else:
//             anime_bat[0] -= 32
//     # Animation vers la droite
//     else:
//         anime_bat[0] = 0
//         anime_bat[1] = 32
//         if anime_bat[0] == 96:
//             anime_bat[0] = 0
//         else:
//             anime_bat[0] += 32
//     return anime_bat
//
// def lvl_up(lvl, x):
//     if x > 850:
//         lvl += 1
//         x = 50
//     return [lvl, x]
//
// def lvl_down(lvl, x):
//     if x < 50:
//         lvl -= 1
//         x = 850
//     return [lvl, x]
//
// def pas_de_retour(x):
//     # Empêche bug et glitch pour sortir de l'écran ou doubler le sprite
//     if x < 50:
//         x = 50
//     return x
//
// def pas_d_avance(x):
//     # Empêche de sortir de l'écran à la fin du jeu
//     if x > 850:
//         x = 850
//     return x
//
// def jeu():
//     lvl = 0
//     # Info chevalier
//     knight_anime = 0
//     knight_xy = [50, 180]
//     knight_speed = 0.75
//     knight_hitbox = 25
//
//     # Infos chauve-souris
//     depart_bat_x = [400, 500, 700]
//     depart_bat_y = 175
//     bat_x = [400, 500, 700]
//     bat_y = 175
//     bat_speed = 0.5
//     anime_bat = [96, 96]
//     sens = -1
//     bat_hitbox = 15
//
//     # Info jeu
//     sol = 180
//     fps = 33
//     sauvegarde = 0
//     vie = 6
//
//     # Par défaut pas de game over
//     game_over = False
//     knight = sprite_knight_walking.subsurface(knight_anime, 0, 42, 42)
//
//     while not game_over:  # tant que le jeu n'est pas fini on ne ferme pas la fenêtre
//         for event in pygame.event.get():
//             if event.type == pygame.QUIT:
//                 game_over = True
//
//         ### Ecran titre ###
//         if lvl == 0:
//             vie = 6
//             surface.fill(Noir)
//             sentence(350, 100, "Legends of Carthagéo", Jaune, 1)
//             sentence(300, 150, "Appuyez sur une touche pour commencer", Blanc, 1)
//             if event.type == pygame.KEYDOWN:
//                 lvl += 1
//
//         ### Niveau 1 ###
//         if lvl == 1:
//             #  Affichage des sprites et des tableaux et actualisation des mouvements
//             surface.blit(tableau[lvl - 1], (0, 0))
//             surface.blit(sprite_wizard, (800, 180))
//             sauvegarde = lvl
//             knight_xy[0] = pas_de_retour(knight_xy[0])
//
//             # Tuto
//             if knight_xy[0]< 250:
//                 sentence(500, 210, "Utilise les flèches <-- et --> pour te déplacer", Blanc, 1)
//                 sentence(500, 225, "et la flèche du haut pour sauter", Blanc, 1)
//
//             # phrase mage
//             if knight_xy[0]> 750:
//                 sentence(500, 205, "Bonjour !", Blanc,1)
//                 sentence(300, 220, "Je vais te présenter la grande légende des puissants héros de Carthageo !", Blanc,
//                          1)
//                 sentence(300, 235, "Prépare-toi à affronter de grands dangers ! Avance vers ton destin", Blanc, 1)
//
//             # Navigation entre les tableaux
//             [lvl, knight_xy[0]] = lvl_up(lvl, knight_xy[0])
//
//         ### Niveau 2 ###
//         if lvl == 2:
//             surface.blit(tableau[lvl - 1], (0, 0))
//             sauvegarde = lvl
//
//             # Les bat
//             # action des chauve-souris
//             sens = sens_bat(bat_x[0], depart_bat_x[0], sens)
//             anime_bat = animation_bat(anime_bat, sens)
//             bat_x[0] += bat_speed * sens
//             surface.blit(sprite_bat.subsurface(anime_bat[0], anime_bat[1], 32, 32), (bat_x[0], bat_y))
//
//             # Coffre de fin de niveau
//             surface.blit(sprite_coffre, (800, 180))
//             if knight_xy[0] > 750:
//                 sentence(700, 0, "Maintenez espace pour", Blanc, 1)
//                 sentence(700, 15, "ouvrir les coffres", Blanc, 1)
//             if event.type == pygame.KEYDOWN:
//                 if event.key == pygame.K_SPACE:
//                     sentence(500, 30, "Vous venez de débloquer le parchemin de ", Jaune, 1)
//                     sentence(500, 45, "Francis Dhée, professeur à l'ENSG qui nous a présenté :", Jaune, 1)
//                     sentence(400, 60, "La carte Topographique Topologie et Histoire de la cartographie ", Jaune, 1)
//
//             # Navigation entre les tableaux
//             [lvl, knight_xy[0]] = lvl_down(lvl, knight_xy[0])
//             [lvl, knight_xy[0]] = lvl_up(lvl, knight_xy[0])
//
//         ### Niveau 3 ###
//         if lvl == 3:
//             surface.blit(tableau[lvl - 1], (0, 0))
//             # Affichage du tableau et du chevalier
//             sauvegarde = lvl
//
//             # Les bat
//             # action des chauve-souris
//             sens = sens_bat(bat_x[0], depart_bat_x[0], sens)
//             anime_bat = animation_bat(anime_bat, sens)
//             bat_x[0] += bat_speed * sens
//             sens = sens_bat(bat_x[1], depart_bat_x[1], sens)
//             anime_bat = animation_bat(anime_bat, sens)
//             bat_x[1] += bat_speed * sens
//             # Apparition des chauve-souris
//             surface.blit(sprite_bat.subsurface(anime_bat[0], anime_bat[1], 32, 32), (bat_x[0], bat_y))
//             surface.blit(sprite_bat.subsurface(anime_bat[0], anime_bat[1], 32, 32), (bat_x[1], bat_y))
//
//             # Coffre de fin de niveau
//             surface.blit(sprite_coffre, (800, 180))
//             if knight_xy[0] > 750:
//                 sentence(700, 0, "Maintenez espace pour", Blanc, 1)
//                 sentence(700, 15, "ouvrir les coffres", Blanc, 1)
//             if event.type == pygame.KEYDOWN:
//                 if event.key == pygame.K_SPACE:
//                     sentence(500, 30, "Vous venez de débloquer le parchemin de ", Jaune, 1)
//                     sentence(500, 45, "Frederic Miotto, Cartographe qui nous a présenté :", Jaune, 1)
//                     sentence(500, 60, "La carte éditoriale ", Jaune, 1)
//
//             # Navigation entre les tableaux
//             [lvl, knight_xy[0]] = lvl_down(lvl, knight_xy[0])
//             [lvl, knight_xy[0]] = lvl_up(lvl, knight_xy[0])
//
//         ### Niveau 4 ###
//         if lvl == 4:
//             surface.blit(tableau[lvl - 1], (0, 0))
//             sauvegarde = lvl
//
//             # Les bat
//             # action des chauve-souris
//             sens = sens_bat(bat_x[0], depart_bat_x[0], sens)
//             anime_bat = animation_bat(anime_bat, sens)
//             bat_x[0] += bat_speed * sens
//             sens = sens_bat(bat_x[1], depart_bat_x[1], sens)
//             anime_bat = animation_bat(anime_bat, sens)
//             bat_x[1] += bat_speed * sens
//             sens = sens_bat(bat_x[2], depart_bat_x[2], sens)
//             anime_bat = animation_bat(anime_bat, sens)
//             bat_x[2] += bat_speed * sens
//             # Apparition des chauves-souris
//             surface.blit(sprite_bat.subsurface(anime_bat[0], anime_bat[1], 32, 32), (bat_x[0], bat_y))
//             surface.blit(sprite_bat.subsurface(anime_bat[0], anime_bat[1], 32, 32), (bat_x[1], bat_y))
//             surface.blit(sprite_bat.subsurface(anime_bat[0], anime_bat[1], 32, 32), (bat_x[2], bat_y))
//
//             # Coffre de fin de niveau
//             surface.blit(sprite_coffre, (800, 180))
//             if knight_xy[0] > 750:
//                 sentence(700, 0, "Maintenez espace pour", Blanc, 1)
//                 sentence(700, 15, "ouvrir les coffres", Blanc, 1)
//             if event.type == pygame.KEYDOWN:
//                 if event.key == pygame.K_SPACE:
//                     sentence(500, 30, "Vous venez de débloquer le parchemin de ", Jaune, 1)
//                     sentence(400, 45, "Marie Jolivet, Cartographe urbaniste qui nous a présenté :", Jaune, 1)
//                     sentence(400, 60, "La cartographie au service de l'urbanisme ", Jaune, 1)
//
//             # Navigation entre les tableaux
//             [lvl, knight_xy[0]] = lvl_down(lvl, knight_xy[0])
//             [lvl, knight_xy[0]] = lvl_up(lvl, knight_xy[0])
//
//         ### Niveau 5 ###
//         if lvl == 5:
//             surface.blit(tableau[lvl - 1], (0, 0))
//
//             # Affichage du tableau
//             sauvegarde = lvl
//
//             # Les bat
//             # action des chauve-souris
//             sens = sens_bat(bat_x[0], depart_bat_x[0], sens)
//             anime_bat = animation_bat(anime_bat, sens)
//             bat_x[0] += bat_speed * sens
//             sens = sens_bat(bat_x[1], depart_bat_x[1], sens)
//             anime_bat = animation_bat(anime_bat, sens)
//             bat_x[1] += bat_speed * sens
//             sens = sens_bat(bat_x[2], depart_bat_x[2], sens)
//             anime_bat = animation_bat(anime_bat, sens)
//             bat_x[2] += bat_speed * sens
//             # Apparition des chauve-souris
//             surface.blit(sprite_bat.subsurface(anime_bat[0], anime_bat[1], 32, 32), (bat_x[0], bat_y))
//             surface.blit(sprite_bat.subsurface(anime_bat[0], anime_bat[1], 32, 32), (bat_x[1], bat_y))
//             surface.blit(sprite_bat.subsurface(anime_bat[0], anime_bat[1], 32, 32), (bat_x[2], bat_y))
//
//             # Coffre de fin de niveau
//             surface.blit(sprite_coffre, (800, 180))
//             if knight_xy[0] > 750:
//                 sentence(700, 0, "Maintenez espace pour", Blanc, 1)
//                 sentence(700, 15, "ouvrir les coffres", Blanc, 1)
//             if event.type == pygame.KEYDOWN:
//                 if event.key == pygame.K_SPACE:
//                     sentence(500, 30, "Vous venez de débloquer le parchemin de ", Jaune, 1)
//                     sentence(400, 45, "Ghislaine Convers, Cartographe aéroportuaire qui nous a présenté :", Jaune, 1)
//                     sentence(400, 60, "La cartographie au service du trafic aéroportuaire ", Jaune, 1)
//
//             # Navigation entre les tableaux
//             [lvl, knight_xy[0]] = lvl_down(lvl, knight_xy[0])
//             [lvl, knight_xy[0]] = lvl_up(lvl, knight_xy[0])
//
//         ### Fin du jeu ###
//         if lvl == 6:
//             surface.fill(Noir)
//             sentence(450, 100, "Fin du jeu", Blanc, 1)
//
//             # Empeche de sortir du tableau de fin de jeu
//             knight_xy[0] = pas_de_retour(knight_xy[0])
//             knight_xy[0] = pas_d_avance(knight_xy[0])
//
//         ### Game Over, perdu ###
//         if lvl == 7:
//             surface.fill(Noir)
//             surface.blit(tableau[5], (200, 0))
//             sentence(500, 150, "appuyez sur une touche pour revivre", Blanc, 1)
//             if event.type == pygame.KEYDOWN:
//                 if vie == 0:
//                     lvl = 0
//                 else:
//                     lvl = sauvegarde
//                 knight_xy[0]= 50
//                 knight_xy[1]= 180
//
//
// ## Hors niveaux ##
//         # déplacements horizontaux (avancer et reculer)
//         if event.type == pygame.KEYDOWN and knight_xy:
//             if event.key == pygame.K_LEFT:
//                 knight_xy[0]-= knight_speed
//                 if knight_anime == 0:
//                     knight_anime = 294
//                 else:
//                     knight_anime -= 42
//             if event.key == pygame.K_RIGHT:
//                 knight_xy[0]+= knight_speed
//                 if knight_anime == 294:
//                     knight_anime = 0
//                 else:
//                     knight_anime += 42
//
//         # Saut
//         if event.type == pygame.KEYDOWN:
//             if event.key == pygame.K_UP:
//                 if knight_xy[1]== sol:
//                     knight_xy[1] -= 42
//                     # pour ne pas marcher en l'air
//                     knight_speed = 0
//         if event.type == pygame.KEYUP:
//             if event.key == pygame.K_UP:
//                     knight_xy[1]= 180
//                     knight_speed = 0.75
//
//             # # Collision avec la chauve-souris 1
//             if lvl in [2, 3, 4, 5]:
//                 if ((knight_xy[0] > bat_x[0] and knight_xy[0] < bat_x[0] + bat_hitbox) or
//                         (knight_xy[0] + knight_hitbox > bat_x[0] and knight_xy[0] < bat_x[0] + bat_hitbox)
//                         and knight_xy [1] == sol):
//                     knight_xy[0] = 50
//                     knight_xy[1] = 180
//                     lvl = 7
//                     vie -= 1
//
//             # # Collision avec la chauve-souris 2
//             if lvl in [3, 4, 5]:
//                 if ((knight_xy[0] > bat_x[1] and knight_xy[0] < bat_x[1] + bat_hitbox) or
//                         (knight_xy[0] + knight_hitbox > bat_x[1] and knight_xy[0] < bat_x[1] + bat_hitbox)
//                         and knight_xy [1] == sol):
//                     knight_xy[0] = 50
//                     knight_xy[1] = 180
//                     lvl = 7
//                     vie -= 1
//
//             # # Collision avec la chauve-souris 3
//             if lvl in [4, 5]:
//                 if ((knight_xy[0] > bat_x[2] and knight_xy[0] < bat_x[2] + bat_hitbox) or
//                         (knight_xy[0] + knight_hitbox > bat_x[2] and knight_xy[0] < bat_x[2] + bat_hitbox)
//                         and knight_xy [1] == sol):
//                     knight_xy[0] = 50
//                     knight_xy[1] = 180
//                     lvl = 7
//                     vie -= 1
//
//         # Vie
//         sentence(0, 0, "Vie = " + str(vie), Blanc, 1)
//         sentence(0, 20, 'Niveau ' + str(lvl), Blanc, 1)
//         knight = sprite_knight_walking.subsurface(knight_anime, 0, 42, 42)
//         surface.blit(knight, (knight_xy[0], knight_xy[1]))
//         pygame.display.update()
//
// # Execution programme
// jeu()
// pygame.quit()
// quit()
