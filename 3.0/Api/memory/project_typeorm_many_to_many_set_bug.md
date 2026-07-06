---
name: project_typeorm_many_to_many_set_bug
description: RelationQueryBuilder.set() lança erro em relações many-to-many — só funciona pra many-to-one/one-to-one
metadata:
  type: project
---

`this.repository.createQueryBuilder().relation(Entity, 'campo').of(id).set(ids)` lança `TypeORMError: Set operation is only supported for many-to-one and one-to-one relations` quando `campo` é `@ManyToMany`.

**Why:** Descoberto ao implementar `usuario.papeis` e `papel.permissoes` (Task 8) — ambas `@ManyToMany` com `@JoinTable`. O código inicial usava `.set(novosIds)` esperando substituir a lista inteira, igual funcionaria numa FK simples.

**How to apply:** Pra "substituir a lista inteira" numa relação many-to-many, buscar os ids atuais, calcular a diferença, e chamar `.add(toAdd)` / `.remove(toRemove)` separadamente (nunca os dois com id repetido, senão dá erro de chave duplicada). Ver `UsuarioTypeOrmRepository.setPapeis` e `PapelTypeOrmRepository.update` em `src/modules/auth/infra/typeorm/` pro padrão exato.
